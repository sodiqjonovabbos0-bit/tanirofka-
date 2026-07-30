'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const DATABASE_URL = String(process.env.DATABASE_URL || '').trim();

let pool = null;
let storageMode = 'json';

function ensureJsonStorage() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]\n', 'utf8');
}

function readJsonOrders() {
  try {
    const parsed = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('orders.json o‘qilmadi:', error);
    return [];
  }
}

function writeJsonOrders(orders) {
  const tempFile = `${ORDERS_FILE}.tmp`;
  fs.writeFileSync(tempFile, `${JSON.stringify(orders, null, 2)}\n`, 'utf8');
  fs.renameSync(tempFile, ORDERS_FILE);
}

function generateCode() {
  return `TR-${crypto.randomInt(100000, 999999)}`;
}

function rowToOrder(row) {
  if (!row) return null;
  return {
    code: row.code,
    name: row.name,
    phone: row.phone,
    phoneDisplay: row.phone_display,
    brand: row.brand,
    model: row.model || '',
    service: row.service,
    tintType: row.tint_type || '',
    serviceOption: row.service_option || '',
    ppfParts: Array.isArray(row.ppf_parts) ? row.ppf_parts : [],
    comment: row.comment || '',
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGSERIAL PRIMARY KEY,
      code VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(80) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      phone_display VARCHAR(30) NOT NULL DEFAULT '',
      brand VARCHAR(60) NOT NULL,
      model VARCHAR(80) NOT NULL DEFAULT '',
      service VARCHAR(20) NOT NULL,
      tint_type VARCHAR(50) NOT NULL DEFAULT '',
      service_option VARCHAR(120) NOT NULL DEFAULT '',
      ppf_parts JSONB NOT NULL DEFAULT '[]'::jsonb,
      comment TEXT NOT NULL DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'accepted',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query('CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC)');
  await pool.query('CREATE INDEX IF NOT EXISTS orders_phone_idx ON orders (phone)');
  await pool.query('CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status)');
}

async function migrateJsonOrdersIfNeeded() {
  ensureJsonStorage();
  const countResult = await pool.query('SELECT COUNT(*)::int AS count FROM orders');
  if (Number(countResult.rows[0]?.count || 0) > 0) return;

  const orders = readJsonOrders();
  if (!orders.length) return;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const order of orders.slice(0, 5000)) {
      await client.query(
        `INSERT INTO orders (
          code, name, phone, phone_display, brand, model, service,
          tint_type, service_option, ppf_parts, comment, status, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12,$13,$14)
        ON CONFLICT (code) DO NOTHING`,
        [
          order.code,
          order.name || '',
          order.phone || '',
          order.phoneDisplay || '',
          order.brand || '',
          order.model || '',
          order.service || '',
          order.tintType || '',
          order.serviceOption || '',
          JSON.stringify(Array.isArray(order.ppfParts) ? order.ppfParts : []),
          order.comment || '',
          order.status || 'accepted',
          order.createdAt || new Date().toISOString(),
          order.updatedAt || order.createdAt || new Date().toISOString()
        ]
      );
    }
    await client.query('COMMIT');
    console.log(`${orders.length} ta JSON buyurtma PostgreSQL bazasiga ko‘chirildi.`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function initStorage() {
  if (!DATABASE_URL) {
    ensureJsonStorage();
    storageMode = 'json';
    console.warn('DATABASE_URL topilmadi. Buyurtmalar orders.json fayliga saqlanadi.');
    return;
  }

  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: DATABASE_URL,
    max: Number(process.env.PG_POOL_MAX || 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    allowExitOnIdle: false
  });
  pool.on('error', (error) => console.error('PostgreSQL pool xatoligi:', error));

  await pool.query('SELECT 1');
  await createTables();
  storageMode = 'postgresql';
  await migrateJsonOrdersIfNeeded();
  console.log('PostgreSQL bazasi ulandi va orders jadvali tayyor.');
}

async function health() {
  if (storageMode === 'postgresql') {
    const result = await pool.query('SELECT NOW() AS now');
    return { mode: storageMode, connected: true, serverTime: result.rows[0].now };
  }
  return { mode: storageMode, connected: true };
}

async function createOrder(orderData) {
  if (storageMode === 'json') {
    const orders = readJsonOrders();
    let code = generateCode();
    while (orders.some((order) => order.code === code)) code = generateCode();
    const order = { code, ...orderData };
    orders.unshift(order);
    writeJsonOrders(orders.slice(0, 5000));
    return order;
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = generateCode();
    try {
      const result = await pool.query(
        `INSERT INTO orders (
          code, name, phone, phone_display, brand, model, service,
          tint_type, service_option, ppf_parts, comment, status, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12,$13,$14)
        RETURNING *`,
        [
          code,
          orderData.name,
          orderData.phone,
          orderData.phoneDisplay,
          orderData.brand,
          orderData.model,
          orderData.service,
          orderData.tintType,
          orderData.serviceOption,
          JSON.stringify(orderData.ppfParts || []),
          orderData.comment,
          orderData.status,
          orderData.createdAt,
          orderData.updatedAt
        ]
      );
      return rowToOrder(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') continue;
      throw error;
    }
  }
  throw new Error('BUYURTMA_KODI_YARATILMADI');
}

async function findOrder(query, phoneDigits) {
  if (storageMode === 'json') {
    const orders = readJsonOrders();
    return orders.find((item) =>
      String(item.code).toLowerCase() === String(query).toLowerCase() ||
      (phoneDigits.length >= 9 && String(item.phone).endsWith(phoneDigits.slice(-9)))
    ) || null;
  }

  const digits = phoneDigits.length >= 9 ? phoneDigits.slice(-9) : '';
  const result = await pool.query(
    `SELECT * FROM orders
     WHERE LOWER(code) = LOWER($1)
        OR ($2 <> '' AND RIGHT(phone, 9) = $2)
     ORDER BY created_at DESC
     LIMIT 1`,
    [query, digits]
  );
  return rowToOrder(result.rows[0]);
}

async function listOrders() {
  if (storageMode === 'json') return readJsonOrders();
  const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5000');
  return result.rows.map(rowToOrder);
}

async function updateOrderStatus(code, status, updatedAt) {
  if (storageMode === 'json') {
    const orders = readJsonOrders();
    const order = orders.find((item) => String(item.code).toUpperCase() === String(code).toUpperCase());
    if (!order) return null;
    order.status = status;
    order.updatedAt = updatedAt;
    writeJsonOrders(orders);
    return order;
  }

  const result = await pool.query(
    `UPDATE orders
     SET status = $1, updated_at = $2
     WHERE UPPER(code) = UPPER($3)
     RETURNING *`,
    [status, updatedAt, code]
  );
  return rowToOrder(result.rows[0]);
}

module.exports = {
  initStorage,
  health,
  createOrder,
  findOrder,
  listOrders,
  updateOrderStatus
};
