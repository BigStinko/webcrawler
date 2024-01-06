const { crawlPage } = require('./crawl.js')
const { printReport } = require('./report.js')

async function main() {
	if (process.argv.length !== 3) {
		console.log('error: incorrect number of arguments')
		return
	}
	const baseURL = process.argv[2]
	console.log(`crawling ${baseURL}`)
	const pages = await crawlPage(baseURL, baseURL, {})
	printReport(pages)
}

main()
