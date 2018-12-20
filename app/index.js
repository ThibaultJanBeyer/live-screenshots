const express = require('express');
const app = express();
const path = require('path');
const fork = require('child_process').fork;

const port = process.env['PORT'] || 3000;
app.use(express.static(path.resolve(`${process.cwd()}/docs`)));

app.get('/', (req, res) =>
  res.sendFile(path.resolve(`${process.cwd()}/docs/index.html`)));

app.get('/sh', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const params = (new URL(fullUrl)).searchParams;
  console.log(params, fullUrl);

  const workerFile = path.normalize(`${process.cwd()}/app/screenshot.js`);
  const child = fork(workerFile);
  child.send({
    url: params.get('url'),
    query: params.get('query'),
    perfect: params.get('perfect'),
  });

  // send the image gotten from puppeteer
  child.on('message', rsp => {
    if (rsp.error) res.status(404);

    const img = new Buffer.from(rsp, 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });

    res.end(img);
  });
});

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}/!`));
