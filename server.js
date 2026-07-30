'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

// Tashqi kutubxonasiz oddiy .env o‘qish
const ENV_FILE = path.join(__dirname, '.env');
if (fs.existsSync(ENV_FILE)) {
  const envText = fs.readFileSync(ENV_FILE, 'utf8');
  envText.split(/\r?\n/).forEach((line) => {
    const value = line.trim();
    if (!value || value.startsWith('#') || !value.includes('=')) return;
    const separator = value.indexOf('=');
    const key = value.slice(0, separator).trim();
    let envValue = value.slice(separator + 1).trim();
    if ((envValue.startsWith('"') && envValue.endsWith('"')) || (envValue.startsWith("'") && envValue.endsWith("'"))) {
      envValue = envValue.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = envValue;
  });
}



const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Tanirovka2026!';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-session-secret-in-production';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_BODY_SIZE = 100 * 1024;
const APP_VERSION = '2026.07-full-pro-6';

const STATUS_VALUES = new Set(['accepted', 'working', 'ready']);
const SERVICE_VALUES = new Set(['tint', 'sun', 'lam', 'ppf', 'clean']);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.wav': 'audio/wav',
  '.ico': 'image/x-icon'
};

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]\n', 'utf8');

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(body);
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(text),
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(text);
}

function readOrders() {
  try {
    const parsed = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('orders.json o‘qilmadi:', error);
    return [];
  }
}

function writeOrders(orders) {
  const tempFile = `${ORDERS_FILE}.tmp`;
  fs.writeFileSync(tempFile, `${JSON.stringify(orders, null, 2)}\n`, 'utf8');
  fs.renameSync(tempFile, ORDERS_FILE);
}

function cleanText(value, maxLength = 200) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[\u0000-\u001F\u007F]/g, '').slice(0, maxLength);
}

function normalizePhone(value) {
  return cleanText(value, 30).replace(/\D/g, '').slice(-15);
}

function publicOrder(order) {
  return {
    code: order.code,
    name: order.name,
    service: order.service,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
}

function generateOrderCode(existingOrders) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const value = crypto.randomInt(100000, 999999);
    const code = `TR-${value}`;
    if (!existingOrders.some((order) => order.code === code)) return code;
  }
  return `TR-${Date.now().toString().slice(-8)}`;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        reject(new Error('REQUEST_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (error) {
        reject(new Error('INVALID_JSON'));
      }
    });
    req.on('error', reject);
  });
}

function safeEqualText(left, right) {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function createAdminToken(username) {
  const payload = Buffer.from(JSON.stringify({ username, exp: Date.now() + SESSION_TTL_MS })).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyAdminToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  const [payload, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  if (!safeEqualText(signature, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.username === ADMIN_USERNAME && Number(data.exp) > Date.now();
  } catch (error) {
    return false;
  }
}

function isAdmin(req) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  return verifyAdminToken(token);
}

async function handleApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, service: 'tanirovka-api', version: APP_VERSION });
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/login') {
    let body;
    try { body = await readJsonBody(req); }
    catch (error) { return sendJson(res, 400, { ok: false, message: 'Login ma’lumoti noto‘g‘ri.' }); }
    const username = cleanText(body.username, 80);
    const password = typeof body.password === 'string' ? body.password.slice(0, 200) : '';
    if (!safeEqualText(username, ADMIN_USERNAME) || !safeEqualText(password, ADMIN_PASSWORD)) {
      return sendJson(res, 401, { ok: false, message: 'Login yoki parol noto‘g‘ri.' });
    }
    return sendJson(res, 200, { ok: true, token: createAdminToken(username), expiresIn: SESSION_TTL_MS });
  }

  if (req.method === 'POST' && url.pathname === '/api/orders') {
    let body;
    try {
      body = await readJsonBody(req);
    } catch (error) {
      const message = error.message === 'REQUEST_TOO_LARGE' ? 'So‘rov hajmi juda katta.' : 'JSON ma’lumoti noto‘g‘ri.';
      return sendJson(res, 400, { ok: false, message });
    }

    const name = cleanText(body.name, 80);
    const phone = normalizePhone(body.phone);
    const brand = cleanText(body.brand, 60);
    const model = cleanText(body.model, 80);
    const service = cleanText(body.service, 20);

    if (name.length < 2) return sendJson(res, 422, { ok: false, message: 'Ismni to‘g‘ri kiriting.' });
    if (!/^998\d{9}$/.test(phone)) return sendJson(res, 422, { ok: false, message: 'Telefon raqamini +998 90 123 45 67 ko‘rinishida to‘liq kiriting.' });
    if (!brand) return sendJson(res, 422, { ok: false, message: 'Avtomobil markasini tanlang.' });
    if (!SERVICE_VALUES.has(service)) return sendJson(res, 422, { ok: false, message: 'Xizmat turini tanlang.' });

    const orders = readOrders();
    const now = new Date().toISOString();
    const order = {
      code: generateOrderCode(orders),
      name,
      phone,
      phoneDisplay: cleanText(body.phone, 30),
      brand,
      model,
      service,
      tintType: cleanText(body.tintType, 50),
      serviceOption: cleanText(body.serviceOption, 120),
      ppfParts: Array.isArray(body.ppfParts) ? body.ppfParts.map((item) => cleanText(item, 50)).filter(Boolean).slice(0, 20) : [],
      comment: cleanText(body.comment, 1000),
      status: 'accepted',
      createdAt: now,
      updatedAt: now
    };

    orders.unshift(order);
    writeOrders(orders.slice(0, 5000));
    return sendJson(res, 201, { ok: true, order: publicOrder(order) });
  }

  if (req.method === 'GET' && url.pathname === '/api/orders/status') {
    const query = cleanText(url.searchParams.get('q') || '', 50);
    if (!query) return sendJson(res, 400, { ok: false, message: 'Buyurtma kodi yoki telefon raqamini kiriting.' });
    const digits = normalizePhone(query);
    const orders = readOrders();
    const order = orders.find((item) =>
      item.code.toLowerCase() === query.toLowerCase() ||
      (digits.length >= 9 && String(item.phone).endsWith(digits.slice(-9)))
    );
    if (!order) return sendJson(res, 404, { ok: false, message: 'Buyurtma topilmadi. Kod yoki telefon raqamini tekshiring.' });
    return sendJson(res, 200, { ok: true, order: publicOrder(order) });
  }

  if (url.pathname.startsWith('/api/admin/')) {
    if (!isAdmin(req)) return sendJson(res, 401, { ok: false, message: 'Admin kaliti noto‘g‘ri.' });

    if (req.method === 'GET' && url.pathname === '/api/admin/orders') {
      const orders = readOrders();
      return sendJson(res, 200, { ok: true, orders });
    }

    const match = url.pathname.match(/^\/api\/admin\/orders\/([^/]+)$/);
    if (req.method === 'PATCH' && match) {
      let body;
      try { body = await readJsonBody(req); }
      catch (error) { return sendJson(res, 400, { ok: false, message: 'JSON ma’lumoti noto‘g‘ri.' }); }
      const status = cleanText(body.status, 20);
      if (!STATUS_VALUES.has(status)) return sendJson(res, 422, { ok: false, message: 'Holat noto‘g‘ri.' });
      const code = decodeURIComponent(match[1]).toUpperCase();
      const orders = readOrders();
      const order = orders.find((item) => item.code.toUpperCase() === code);
      if (!order) return sendJson(res, 404, { ok: false, message: 'Buyurtma topilmadi.' });
      order.status = status;
      order.updatedAt = new Date().toISOString();
      writeOrders(orders);
      return sendJson(res, 200, { ok: true, order });
    }
  }

  return sendJson(res, 404, { ok: false, message: 'API manzili topilmadi.' });
}

function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/admin') pathname = '/admin.html';

  const safePath = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);
  if (!filePath.startsWith(PUBLIC_DIR)) return sendText(res, 403, 'Taqiqlangan');

  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) return sendText(res, 404, 'Sahifa topilmadi');
    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || 'application/octet-stream';
    const cacheControl = extension === '.html' || extension === '.js' || extension === '.css'
      ? 'no-cache'
      : 'public, max-age=604800, immutable';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'SAMEORIGIN'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) {
      setCorsHeaders(res);
      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
      }
    }
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    if (!['GET', 'HEAD'].includes(req.method)) return sendJson(res, 405, { ok: false, message: 'Metodga ruxsat yo‘q.' });
    return serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { ok: false, message: 'Server ichki xatoligi.' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`TANIROVKA server: http://${HOST}:${PORT}`);
  if (ADMIN_PASSWORD === 'Tanirovka2026!') console.warn('DIQQAT: ADMIN_PASSWORD ni productionda almashtiring.');
  if (SESSION_SECRET === 'change-this-session-secret-in-production') console.warn('DIQQAT: SESSION_SECRET ni productionda almashtiring.');
});
