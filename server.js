const { createServer } = require('node:http');
const { parse } = require('node:url');
const next = require('next');

const port = Number.parseInt(process.env.PORT || '3000', 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res, parse(req.url, true));
    }).listen(port);
  })
  .catch((error) => {
    console.error('Failed to start the Next.js server:', error);
    process.exit(1);
  });
