const http = require('http');
const httpProxy = require('http-proxy-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: 'http://127.0.0.1:9293',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug'
});

const server = http.createServer((req, res) => {
  proxy(req, res);
});

server.on('upgrade', (req, socket, head) => {
  proxy.upgrade(req, socket, head);
});

const PORT = 9292;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Proxy-Server läuft auf http://${HOST}:${PORT}`);
  console.log(`Für mobile Geräte: http://192.168.178.65:${PORT}`);
});

