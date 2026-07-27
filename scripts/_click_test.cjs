const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({viewport: {width: 1400, height: 900}});
  await page.goto('http://localhost:3000/shell-preview-tmp');
  await page.click('text=Select Project');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/ARYAN_~1/AppData/Local/Temp/modal_check.png' });
  await browser.close();
})();
