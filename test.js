const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    _videosPath: __dirname  //  save videos here.
  });
  const context = await browser.newContext({
    _recordVideos: { width: 1024, height: 768 },  // downscale
  });
  const page = await context.newPage();
  const video = await page.waitForEvent('_videostarted');
  await page.goto('https://github.com/microsoft/playwright');
  // ... perform actions
  await page.close();
  fs.renameSync(await video.path(), 'video.webm');
  await browser.close();
})();