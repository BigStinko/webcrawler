const { JSDOM } = require('jsdom')

async function crawlPage(baseURL, currentURL, pages) {
	const currentURLObj = new URL(currentURL)
	const baseURLOBj = new URL(baseURL)
	if (currentURLObj.hostname !== baseURLOBj.hostname) {
		return pages
	}

	const normal = normalizeURL(currentURL)
	if (pages[normal] > 0) {
		pages[normal]++
		return pages
	} else if (baseURL === currentURL) {
		pages[normal] = 0
	} else {
		pages[normal] = 1
	}

	console.log(`crawling ${currentURL}`)
	let html = ''

	try {
		const response = await fetch(currentURL)
		if (response.status > 399) {
			console.log(`HTTP error: ${response.status}`)
			return pages
		}
		const contentType = response.headers.get('content-type')
		if (!contentType.includes('text/html')) {
			console.log(`got non-html response: ${contentType}`)
			return pages
		}
		html = await response.text()
	} catch (err) {
		console.log(err.message)
	}

	const URLs = getURLsFromHTML(html, baseURL)
	for (const nextURL of URLs) {
		pages = await crawlPage(baseURL, nextURL, pages)
	}

	return pages
}

function getURLsFromHTML(htmlBody, baseURL) {
	const urls = []
	const html = new JSDOM(htmlBody)
	const aElements = html.window.document.querySelectorAll('a')
	for (const aElement of aElements) {
		// if the link uses the same base URL
		if (aElement.href.slice(0,1) === '/') {
			try {
				urls.push(new URL(aElement.href, baseURL).href)
			} catch (err) {
				console.log(`${err.message}: ${aElement.href}`)
			}
		// if the link comes with a base URL
		} else {
			try {
				urls.push(new URL(aElement.href).href)
			} catch (err) {
				console.log(`${err.message}: ${aElement.href}`)
			}
		}
	}
	return urls
}

function normalizeURL(url) {
	const urlObj = new URL(url)
	let fullPath = `${urlObj.host}${urlObj.pathname}`
	if (fullPath.length > 0 && fullPath.slice(-1) === '/') {
		fullPath = fullPath.slice(0, -1)
	}
	return fullPath
}

module.exports = {
	normalizeURL,
	getURLsFromHTML,
	crawlPage
}

