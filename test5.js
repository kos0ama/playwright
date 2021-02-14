﻿const { chromium } = require('playwright');

(async () => {
	const browser = await chromium.launch({
		headless: false,
	});
	const context = await browser.newContext();

	// Open new page
	const page = await context.newPage();

	// Go to https://cloudapi.zendesk.com/hc/ja/articles/206365461
	await page.goto('https://cloudapi.zendesk.com/hc/ja/articles/206365461');

	// Close page
	await page.close();

	// ---------------------
	await context.close();
	await browser.close();
})();
