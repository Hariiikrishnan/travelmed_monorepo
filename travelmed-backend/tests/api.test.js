import test from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';

// Integration tests — run against the database in DATABASE_URL (use a dev/test DB, never production).
// Requires `npm run prisma:seed` (creates the kit product). Admin-only tests run when
// ADMIN_EMAIL / ADMIN_PASSWORD are set to the seeded admin's credentials.

const KIT_ID = 'kit-standard-india';
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
const hasAdmin = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

let server;
let baseUrl;
let adminToken = '';
let kit;

const json = (method, body, token) => ({
  method,
  headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  body: body === undefined ? undefined : JSON.stringify(body),
});

const shippingAddress = {
  fullName: 'Test Traveller',
  address: '12 Test Street, Indiranagar',
  city: 'Bengaluru',
  country: 'India',
  zipCode: '560038',
  phone: '+919800000000',
  email: 'test.traveller@example.com',
};

/** Creates a checkout via the dummy (non-production) Razorpay flow; optionally verifies payment. */
const createOrder = async ({ pay = true, items = [{ productId: KIT_ID, quantity: 1 }] } = {}) => {
  const res = await fetch(`${baseUrl}/payments/create-order`, json('POST', { items, shippingAddress }));
  const body = await res.json();
  assert.strictEqual(res.status, 200, JSON.stringify(body));
  assert.strictEqual(body.data.isDummy, true, 'tests must run without real Razorpay keys');
  if (!pay) return { orderId: body.data.orderId, amount: body.data.amount };

  const verifyRes = await fetch(
    `${baseUrl}/payments/verify`,
    json('POST', { razorpay_order_id: body.data.id, razorpay_payment_id: `pay_test_${Date.now()}` })
  );
  const verifyBody = await verifyRes.json();
  assert.strictEqual(verifyRes.status, 200, JSON.stringify(verifyBody));
  return verifyBody.data;
};

const book = (orderId, symptom = 'Fever') =>
  fetch(`${baseUrl}/consultations`, json('POST', { orderId, whatsapp: '+91 98000 00000', symptom, destination: 'Thailand' }));

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}/api`;
      resolve();
    });
  });
});

test.after(() => {
  server.close();
});

// ── Catalogue ──

test('GET /api/medicines returns medicines', async () => {
  const res = await fetch(`${baseUrl}/medicines`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(body.data) && body.data.length > 0);
});

test('GET /api/medicines/:id with an unknown id returns 404', async () => {
  const res = await fetch(`${baseUrl}/medicines/non-existent-id`);
  assert.strictEqual(res.status, 404);
});

test('GET /api/products/:slug returns the kit with its admin-set price', async () => {
  const res = await fetch(`${baseUrl}/products/${KIT_ID}`);
  const body = await res.json();
  assert.strictEqual(res.status, 200, 'run `npm run prisma:seed` to create the kit product');
  kit = body.data;
  assert.strictEqual(kit.id, KIT_ID);
  assert.ok(kit.price > 0 && kit.price <= kit.mrp);
  assert.ok(body.data.commerce || body.commerce, 'public product response includes commerce config');
});

test('GET /api/testimonials only returns approved reviews', async () => {
  const res = await fetch(`${baseUrl}/testimonials`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(body.data.every((t) => t.status === 'Approved'));
});

test('GET /api/doctors only returns active doctors', async () => {
  const res = await fetch(`${baseUrl}/doctors`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(body.data.every((d) => d.status !== 'Inactive'));
});

// ── Pricing & checkout security ──

test('POST /api/orders/quote prices from the database and ignores client prices', async () => {
  const res = await fetch(
    `${baseUrl}/orders/quote`,
    json('POST', { items: [{ productId: KIT_ID, quantity: 2, price: 1, name: 'Hacked' }] })
  );
  const body = await res.json();
  assert.strictEqual(res.status, 200, JSON.stringify(body));
  assert.strictEqual(body.data.subtotal, kit.price * 2);
  assert.strictEqual(body.data.total, body.data.subtotal - body.data.discount + body.data.shippingCost);
});

test('POST /api/orders/quote rejects unknown products and invalid coupons', async () => {
  const unknown = await fetch(`${baseUrl}/orders/quote`, json('POST', { items: [{ productId: 'nope', quantity: 1 }] }));
  assert.ok(unknown.status >= 400 && unknown.status < 500);

  const coupon = await fetch(
    `${baseUrl}/orders/quote`,
    json('POST', { items: [{ productId: KIT_ID, quantity: 1 }], couponCode: 'NOT-A-REAL-CODE-123' })
  );
  assert.strictEqual(coupon.status, 400);
});

test('POST /api/orders (client-created "Paid" orders) no longer exists', async () => {
  const res = await fetch(
    `${baseUrl}/orders`,
    json('POST', { items: [{ productId: KIT_ID, quantity: 1 }], shippingAddress, paymentStatus: 'Paid' })
  );
  assert.ok(res.status === 404 || res.status === 405, `expected 404/405, got ${res.status}`);
});

test('create-order charges the server price, and the order is Pending until payment is verified', async () => {
  const { orderId, amount } = await createOrder({ pay: false });
  assert.ok(orderId.startsWith('TM-'));

  const quote = await (await fetch(`${baseUrl}/orders/quote`, json('POST', { items: [{ productId: KIT_ID, quantity: 1 }] }))).json();
  assert.strictEqual(amount, Math.round(quote.data.total * 100));

  const track = await (await fetch(`${baseUrl}/orders/${orderId}`)).json();
  assert.strictEqual(track.data.paymentStatus, 'Pending');
  assert.strictEqual(track.data.status, 'Pending');
});

test('verify marks the order Paid, and public tracking hides personal details', async () => {
  const order = await createOrder();
  assert.strictEqual(order.paymentStatus, 'Paid');

  const track = await (await fetch(`${baseUrl}/orders/${order.orderId}`)).json();
  assert.strictEqual(track.data.paymentStatus, 'Paid');
  assert.strictEqual(track.data.shippingAddress.fullName, 'Test');
  assert.strictEqual(track.data.shippingAddress.city, 'Bengaluru');
  assert.strictEqual(track.data.shippingAddress.address, undefined);
  assert.strictEqual(track.data.shippingAddress.phone, undefined);
  assert.strictEqual(track.data.shippingAddress.email, undefined);
});

test('verify rejects a real Razorpay order id without a valid signature', async () => {
  const res = await fetch(
    `${baseUrl}/payments/verify`,
    json('POST', { razorpay_order_id: 'order_FAKE123', razorpay_payment_id: 'pay_FAKE123', razorpay_signature: 'bad' })
  );
  assert.ok(res.status >= 400 && res.status < 500, `expected 4xx, got ${res.status}`);
});

// ── Teleconsultations: max 2 per order ──

test('consultations require a paid order', async () => {
  const unpaid = await createOrder({ pay: false });
  const res = await book(unpaid.orderId);
  assert.ok(res.status >= 400 && res.status < 500);

  const missing = await book('TM-DOESNOTEXIST');
  assert.ok(missing.status >= 400 && missing.status < 500);
});

test('an order gets exactly 2 teleconsultations; the 3rd returns 409', async () => {
  const order = await createOrder();

  const first = await book(order.orderId, 'Fever');
  const firstBody = await first.json();
  assert.strictEqual(first.status, 201, JSON.stringify(firstBody));
  assert.strictEqual(firstBody.data.sequence, 1);
  assert.strictEqual(firstBody.data.consultationsRemaining, 1);

  const second = await book(order.orderId, 'Diarrhoea');
  const secondBody = await second.json();
  assert.strictEqual(second.status, 201);
  assert.strictEqual(secondBody.data.sequence, 2);
  assert.strictEqual(secondBody.data.consultationsRemaining, 0);

  const third = await book(order.orderId, 'Cough');
  const thirdBody = await third.json();
  assert.strictEqual(third.status, 409);
  assert.match(thirdBody.message, /teleconsultations/i);
});

test('simultaneous requests cannot exceed 2 consultations per order', async () => {
  const order = await createOrder();
  const results = await Promise.all([book(order.orderId, 'A1'), book(order.orderId, 'B2'), book(order.orderId, 'C3'), book(order.orderId, 'D4')]);
  const created = results.filter((r) => r.status === 201).length;
  assert.strictEqual(created, 2, `expected 2 bookings, got ${results.map((r) => r.status).join(',')}`);
});

// ── Admin ──

test('POST /api/auth/register is not public', async () => {
  const res = await fetch(
    `${baseUrl}/auth/register`,
    json('POST', { name: 'Intruder', email: `intruder${Date.now()}@example.com`, password: 'SuperSecret123!' })
  );
  assert.strictEqual(res.status, 401);
});

test('POST /api/auth/login rejects wrong credentials', async () => {
  const res = await fetch(`${baseUrl}/auth/login`, json('POST', { email: 'admin@travelmed.com', password: 'WrongPassword1' }));
  assert.strictEqual(res.status, 401);
});

test('admin endpoints require a token', async () => {
  for (const path of ['/orders', '/consultations', '/products/admin/all', '/testimonials/admin/all', '/doctors/admin/all']) {
    const res = await fetch(`${baseUrl}${path}`);
    assert.strictEqual(res.status, 401, path);
  }
});

test('POST /api/auth/login logs in the admin', { skip: !hasAdmin && 'set ADMIN_EMAIL / ADMIN_PASSWORD' }, async () => {
  const res = await fetch(`${baseUrl}/auth/login`, json('POST', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }));
  const body = await res.json();
  assert.strictEqual(res.status, 200, JSON.stringify(body));
  adminToken = body.data.token;
});

test('cancelling a consultation frees a slot; re-activating over the limit is blocked', { skip: !hasAdmin && 'needs admin login' }, async () => {
  const order = await createOrder();
  const first = await (await book(order.orderId, 'Fever')).json();
  await book(order.orderId, 'Cough');
  assert.strictEqual((await book(order.orderId, 'Rash')).status, 409);

  const cancel = await fetch(`${baseUrl}/consultations/${first.data.id}`, json('PATCH', { status: 'Cancelled' }, adminToken));
  assert.strictEqual(cancel.status, 200);

  const again = await book(order.orderId, 'Rash');
  assert.strictEqual(again.status, 201);

  const reactivate = await fetch(`${baseUrl}/consultations/${first.data.id}`, json('PATCH', { status: 'New' }, adminToken));
  assert.strictEqual(reactivate.status, 409);

  const orders = await (await fetch(`${baseUrl}/orders`, json('GET', undefined, adminToken))).json();
  const row = orders.data.find((o) => o.orderId === order.orderId);
  assert.strictEqual(row.consultationsUsed, 2);
  assert.strictEqual(row.consultationsRemaining, 0);
});

test('an unpaid order can only be Pending or Cancelled', { skip: !hasAdmin && 'needs admin login' }, async () => {
  const { orderId } = await createOrder({ pay: false });
  const ship = await fetch(`${baseUrl}/orders/${orderId}/status`, json('PATCH', { status: 'Shipped' }, adminToken));
  assert.strictEqual(ship.status, 400);
  const cancel = await fetch(`${baseUrl}/orders/${orderId}/status`, json('PATCH', { status: 'Cancelled' }, adminToken));
  assert.strictEqual(cancel.status, 200);
});

test('admin can update a paid order status and tracking reflects it', { skip: !hasAdmin && 'needs admin login' }, async () => {
  const order = await createOrder();
  const res = await fetch(`${baseUrl}/orders/${order.orderId}/status`, json('PATCH', { status: 'Shipped' }, adminToken));
  assert.strictEqual(res.status, 200);
  const track = await (await fetch(`${baseUrl}/orders/${order.orderId}`)).json();
  assert.strictEqual(track.data.status, 'Shipped');
});

test('admin product price change is what checkout charges', { skip: !hasAdmin && 'needs admin login' }, async () => {
  const original = kit.price;
  const newPrice = original - 1;
  const { id, createdAt, updatedAt, commerce, ...fields } = kit; // eslint-disable-line no-unused-vars
  const payload = (price) => ({ ...fields, description: fields.description ?? '', seoTitle: fields.seoTitle ?? '', seoDescription: fields.seoDescription ?? '', price });
  try {
    const put = await fetch(`${baseUrl}/products/${KIT_ID}`, json('PUT', payload(newPrice), adminToken));
    assert.strictEqual(put.status, 200, JSON.stringify(await put.json()));
    const quote = await (await fetch(`${baseUrl}/orders/quote`, json('POST', { items: [{ productId: KIT_ID, quantity: 1 }] }))).json();
    assert.strictEqual(quote.data.subtotal, newPrice);
  } finally {
    await fetch(`${baseUrl}/products/${KIT_ID}`, json('PUT', payload(original), adminToken));
  }
});

// ── Multi-kit catalogue ──
// These tests create their own temporary kits directly in the database so they run
// without admin credentials, and remove them (and their orders) afterwards.

const prismaModule = await import('../src/config/database.js');
const prisma = prismaModule.default;
const TEMP_KITS = ['test-kit-short', 'test-kit-noconsult'];

const makeKit = (id, { price, consultsIncluded }) =>
  prisma.product.upsert({
    where: { id },
    update: { price, mrp: price + 500, consultsIncluded, stock: 100, status: 'In Stock', visibility: 'Visible' },
    create: {
      id, slug: id, name: `Test ${id}`, sku: id.toUpperCase(), price, mrp: price + 500,
      stock: 100, consultsIncluded, visibility: 'Visible',
      items: { create: [{ medicineId: 'med-paracetamol', quantity: 10, unit: 'tablets' }] },
    },
  });

test('multi-kit: setup temporary kits', async () => {
  await makeKit('test-kit-short', { price: 1200, consultsIncluded: 1 });
  await makeKit('test-kit-noconsult', { price: 800, consultsIncluded: 0 });
});

test('GET /api/products lists visible kits with contents and counts', async () => {
  const body = await (await fetch(`${baseUrl}/products`)).json();
  const short = body.data.find((k) => k.id === 'test-kit-short');
  assert.ok(short, 'temporary kit is listed');
  assert.strictEqual(short.counts.medicines, 1);
  assert.strictEqual(short.counts.units, 10);
  assert.strictEqual(short.items[0].medicineId, 'med-paracetamol');
  assert.ok(short.categories.length === 1 && short.categories[0].name);
  assert.ok(body.data.every((k) => k.visibility === 'Visible'));
});

test('kit types and medicine categories are public lists; admin lists need a token', async () => {
  const types = await (await fetch(`${baseUrl}/kit-types`)).json();
  const cats = await (await fetch(`${baseUrl}/medicine-categories`)).json();
  assert.ok(types.data.length >= 1);
  assert.ok(cats.data.length >= 1);
  assert.strictEqual((await fetch(`${baseUrl}/kit-types/admin/all`)).status, 401);
  assert.strictEqual((await fetch(`${baseUrl}/medicine-categories/admin/all`)).status, 401);
});

test('a quote with two different kits sums both server prices and their consults', async () => {
  const res = await fetch(
    `${baseUrl}/orders/quote`,
    json('POST', { items: [{ productId: KIT_ID, quantity: 1 }, { productId: 'test-kit-short', quantity: 2 }] })
  );
  const body = await res.json();
  assert.strictEqual(res.status, 200, JSON.stringify(body));
  assert.strictEqual(body.data.subtotal, kit.price + 2 * 1200);
  assert.strictEqual(body.data.consultsIncluded, kit.consultsIncluded + 2 * 1);
});

test('consult limit is the sum of the kits in the order (2 + 1 = 3)', async () => {
  const order = await createOrder({ items: [{ productId: KIT_ID, quantity: 1 }, { productId: 'test-kit-short', quantity: 1 }] });
  const results = [];
  for (const s of ['A1', 'B2', 'C3', 'D4']) results.push((await book(order.orderId, s)).status);
  assert.deepStrictEqual(results, [201, 201, 201, 409]);
});

test('a kit without teleconsultations cannot book one', async () => {
  const order = await createOrder({ items: [{ productId: 'test-kit-noconsult', quantity: 1 }] });
  const res = await book(order.orderId);
  const body = await res.json();
  assert.strictEqual(res.status, 400);
  assert.match(body.message, /doesn't include/i);
});

test('hidden kits disappear from the public catalogue and cannot be bought', async () => {
  await prisma.product.update({ where: { id: 'test-kit-short' }, data: { visibility: 'Hidden' } });
  const list = await (await fetch(`${baseUrl}/products`)).json();
  assert.ok(!list.data.some((k) => k.id === 'test-kit-short'));
  assert.strictEqual((await fetch(`${baseUrl}/products/test-kit-short`)).status, 404);
  const quote = await fetch(`${baseUrl}/orders/quote`, json('POST', { items: [{ productId: 'test-kit-short', quantity: 1 }] }));
  assert.strictEqual(quote.status, 400);
});

test('multi-kit: clean up temporary kits and their orders', async () => {
  const items = await prisma.orderItem.findMany({ where: { productId: { in: TEMP_KITS } }, select: { orderId: true } });
  await prisma.order.deleteMany({ where: { orderId: { in: [...new Set(items.map((i) => i.orderId))] } } });
  await prisma.product.deleteMany({ where: { id: { in: TEMP_KITS } } });
  await prisma.$disconnect();
});
