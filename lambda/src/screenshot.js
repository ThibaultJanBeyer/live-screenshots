const chromium = require('chrome-aws-lambda');

let page;

const findElement = async (query = 'body') => {
  let element = await page.$(query);
  if (!element) throw new Error(`no element found for query ${query}`);
  element = await page.$eval(query, el => JSON.stringify({
    rect: el.getBoundingClientRect(),
    realWidth: parseInt(window.getComputedStyle(el).getPropertyValue("width")),
    realHeight: parseInt(window.getComputedStyle(el).getPropertyValue("height")),
  }));
  return JSON.parse(element);
}

module.exports = async ({
  url = "https://example.com",
  viewport,
  query,
  perfect
}) => {
  console.log('data', url, viewport, query, perfect);

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  page = await browser.newPage();
  await page.goto(url);

  // Browser size
  if (viewport)
    await page.setViewport(viewport);

  // Find element
  const element = await findElement(query);

  const perfectX = element.rect.x + element.rect.width - element.realWidth;
  const perfectY = element.rect.y + element.rect.height - element.realHeight;

  // Take screenshot
  let screen = await page.screenshot({
    clip: {
      x: perfect ? perfectX : element.rect.x,
      y: perfect ? perfectY : element.rect.y,
      width: perfect ? element.realWidth : element.rect.width,
      height: perfect ? element.realHeight : element.rect.height
    },
    encoding: "base64"
  });

  await browser.close();

  return screen
}
