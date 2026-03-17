const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const APP_DIR = path.join(__dirname, 'app');
const LAYOUT_FILE = path.join(__dirname, 'app', 'layout.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.ico': 'image/x-icon'
};

function send(res, statusCode, body, contentType, extraHeaders) {
  const headers = { 'Content-Type': contentType || 'text/plain; charset=utf-8' };
  if (extraHeaders) Object.assign(headers, extraHeaders);
  res.writeHead(statusCode, headers);
  res.end(body);
}

function serveFile(filePath, res, reqUrl) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') { send(res, 404, 'Not Found'); return; }
      send(res, 500, err.message);
      return;
    }
    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';
    const isStaticAsset = reqUrl.startsWith('/assets/') || reqUrl.startsWith('/fonts/');
    const headers = isStaticAsset ? { 'Cache-Control': 'public, max-age=604800' } : undefined;
    res.writeHead(200, { 'Content-Type': contentType, ...headers });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  const method = req.method;

  if (method === 'GET' && url === '/layout.json') {
    fs.readFile(LAYOUT_FILE, (err, data) => {
      if (err && err.code === 'ENOENT') { send(res, 404, '{}', MIME['.json']); return; }
      if (err) { send(res, 500, err.message); return; }
      send(res, 200, data, MIME['.json'], { 'Cache-Control': 'no-cache, no-store, must-revalidate' });
    });
    return;
  }

  if (method === 'POST' && url === '/api/layout') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString();
        const json = JSON.parse(body);
        fs.writeFile(LAYOUT_FILE, JSON.stringify(json, null, 0), 'utf8', (err) => {
          if (err) { send(res, 500, err.message); return; }
          res.writeHead(200, { 'Content-Type': MIME['.json'] });
          res.end(JSON.stringify({ ok: true }));
        });
      } catch (e) {
        send(res, 400, 'Invalid JSON');
      }
    });
    return;
  }

  let filePath = path.join(APP_DIR, url === '/' ? 'index.html' : url);
  if (!filePath.startsWith(APP_DIR)) {
    send(res, 403, 'Forbidden');
    return;
  }
  serveFile(filePath, res, url);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('PMSmart app 服务: http://localhost:' + PORT + '/');
});
