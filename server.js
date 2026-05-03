// ─────────────────────────────────────────────────────────────
//  법령분석시스템 로컬 서버 (server.js)
//  - API 키를 .env 파일에 보관 → 브라우저에 절대 노출 안 됨
//  - http://localhost:3000 으로 접속
// ─────────────────────────────────────────────────────────────

require('dotenv').config();
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT    = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

if (!API_KEY) {
  console.error('\n❌  .env 파일에 ANTHROPIC_API_KEY가 없습니다.');
  console.error('   .env 파일을 만들고 아래 내용을 입력하세요:\n');
  console.error('   ANTHROPIC_API_KEY=sk-ant-...\n');
  process.exit(1);
}

// ── MIME types ────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
};

// ── Helper: read body ─────────────────────────────────────────
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end',  () => resolve(body));
    req.on('error', reject);
  });
}

// ── Server ────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {

  // CORS headers (localhost only)
  res.setHeader('Access-Control-Allow-Origin', `http://localhost:${PORT}`);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  // ── API proxy endpoint ──────────────────────────────────────
  if (req.method === 'POST' && req.url === '/api/chat') {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body);

      // Forward to Anthropic
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method:  'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model:      payload.model      || 'claude-sonnet-4-20250514',
          max_tokens: payload.max_tokens || 8096,
          system:     payload.system     || '',
          messages:   payload.messages   || [],
          ...(payload.tools ? { tools: payload.tools } : {}),
        }),
      });

      const data = await upstream.json();
      res.writeHead(upstream.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: err.message } }));
    }
    return;
  }

  // ── Static file serving ─────────────────────────────────────
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, 'public', filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext  = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n✅  법령분석시스템 서버 시작!');
  console.log(`\n   👉  브라우저에서 열기:  http://localhost:${PORT}\n`);
});
