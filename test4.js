const playwright = require("playwright").chromium;

(async () => {
  const browser = await playwright.launch({
      headless: false,
    });
    const browserType = 'sample';
    const context = await browser.newContext();
    // Open new page
    const page = await context.newPage();
    // Go to https://playwright.dev/
    await page.goto("https://cloudapi.zendesk.com/hc/ja/articles/206365461");
    await page.screenshot({ path: `example-${browserType}.png` });
    // Close page
    await page.close();
    await context.close();
    await browser.close();
})();