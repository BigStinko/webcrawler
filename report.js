function printReport(pages) {
	const sortedPages = Object.keys(pages).sort((a, b) => pages[b] - pages[a])
	for (const page of sortedPages) {
		console.log(`Found ${pages[page]} internal links to ${page}`)
	}
}

module.exports = {
	printReport
}
