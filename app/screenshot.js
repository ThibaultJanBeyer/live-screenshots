const puppeteer = require('puppeteer');

function start(data) {
  (async () => {
    console.log(data);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(data.url);

    let screen;
    if (data.query) {
      const element = await findElement(data.query);

      const perfectX = element.rect.x + element.rect.width - element.realWidth;
      const perfectY = element.rect.y + element.rect.height - element.realHeight;

      screen = await page.screenshot({
        clip: {
          x: data.perfect ? perfectX : element.rect.x,
          y: data.perfect ? perfectY : element.rect.y,
          width: data.perfect ? element.realWidth : element.rect.width,
          height: data.perfect ? element.realHeight : element.rect.height
        },
        encoding: "base64"
      });
    } else {
      screen = await page.screenshot({
        encoding: "base64"
      });
    }

    process.send(screen);

    await browser.close();

    async function findElement(query) {
      let element = await page.$(query);
      if (!element) throw {
        message: `no element found for query ${query}`
      };
      element = await page.$eval(query, el => JSON.stringify({
        rect: el.getBoundingClientRect(),
        realWidth: parseInt(window.getComputedStyle(el).getPropertyValue("width")),
        realHeight: parseInt(window.getComputedStyle(el).getPropertyValue("height")),
      }));
      return JSON.parse(element);
    }

  })()
  .catch(e => {
      console.log("BIG E", e)
      e.error = true;
      process.send(e);
    })
    .finally(e => console.log("outer final error", e));
}

// MESSAGES
////////////////////////////////////////////////////

process.on("message", function (m) {
  const data = m;
  console.log(m);
  data.url = data.url || "https://example.com";
  start(data);
});
