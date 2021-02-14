const playwright = require('playwright');

//playwrightのdevicesにhttps://github.com/microsoft/playwright/blob/master/src/deviceDescriptors.tsの任意のものを指定することで、デバイスを取得できる。
const iphone11 = playwright.devices['iPhone 11'];

(async () => {
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    const browser = await playwright[browserType].launch();
    // newContextの引数にiphone11を渡してあげることで、デバイスを偽造できる。
    const context = await browser.newContext({
      ...iphone11
    });
    const page = await context.newPage();

    await page.goto('https://yourbrowser.is/');
    await page.screenshot({ path: `example-${browserType}.png`, fullPage: true });
    await browser.close();
  }
})();