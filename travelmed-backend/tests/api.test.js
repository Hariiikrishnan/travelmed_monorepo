import test from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';

let server;
let port;
let baseUrl;
let adminToken = '';

test.before(async () => {
  // Start server on random free port
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      port = server.address().port;
      baseUrl = `http://localhost:${port}/api`;
      resolve();
    });
  });
});

test.after(() => {
  server.close();
});

test('GET /api/medicines should return a list of medicines', async () => {
  const res = await fetch(`${baseUrl}/medicines`);
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.ok(body.data.length > 0);
  assert.strictEqual(body.data[0].id, 'med-aceclofenac'); // alphabetical order
});

test('GET /api/medicines/:id should return a specific medicine', async () => {
  const res = await fetch(`${baseUrl}/medicines/med-paracetamol`);
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.name, 'Paracetamol 650mg');
});

test('GET /api/medicines/:id with invalid id should return 404', async () => {
  const res = await fetch(`${baseUrl}/medicines/non-existent-id`);
  const body = await res.json();

  assert.strictEqual(res.status, 404);
  assert.strictEqual(body.success, false);
});

test('GET /api/doctors should return a list of doctors', async () => {
  const res = await fetch(`${baseUrl}/doctors`);
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.ok(Array.isArray(body.data));
});

test('GET /api/travel-scenarios should return scenarios', async () => {
  const res = await fetch(`${baseUrl}/travel-scenarios`);
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.ok(Array.isArray(body.data));
});

test('GET /api/testimonials should return testimonials', async () => {
  const res = await fetch(`${baseUrl}/testimonials`);
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.ok(Array.isArray(body.data));
});

test('POST /api/auth/login should log in the admin user', async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@travelmed.com',
      password: 'AdminPassword123'
    })
  });
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.ok(body.data.token);
  adminToken = body.data.token;
});

test('POST /api/auth/login with incorrect credentials should return 401', async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@travelmed.com',
      password: 'WrongPassword'
    })
  });
  const body = await res.json();

  assert.strictEqual(res.status, 401);
  assert.strictEqual(body.success, false);
});

test('POST /api/orders should place a new order successfully', async () => {
  const orderData = {
    shippingAddress: {
      fullName: 'John Doe',
      address: '123 Test Street, Apt 4B',
      city: 'Mumbai',
      country: 'India',
      zipCode: '400001'
    },
    items: [
      {
        id: 'kit-standard-india',
        name: 'Travel Med Kit - Standard Package',
        price: 2900,
        quantity: 1,
        type: 'kit',
        description: 'Includes 150+ curated medicines...',
        options: {
          size: 'Solo'
        }
      }
    ]
  };

  const res = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  const body = await res.json();

  assert.strictEqual(res.status, 201);
  assert.strictEqual(body.success, true);
  assert.ok(body.data.orderId);
  assert.strictEqual(body.data.status, 'Processing');
  assert.strictEqual(body.data.total, 2900); // price > 150 -> free shipping
});

test('GET /api/orders/:orderId should return tracking information', async () => {
  // First create an order to track
  const orderData = {
    shippingAddress: {
      fullName: 'Jane Doe',
      address: '456 Test Lane',
      city: 'Delhi',
      country: 'India',
      zipCode: '110001'
    },
    items: [
      {
        id: 'med-ors',
        name: 'ORS Hydration Salts',
        price: 50,
        quantity: 2,
        type: 'addon'
      }
    ]
  };

  const createRes = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  const createBody = await createRes.json();
  const createdOrderId = createBody.data.orderId;

  // Track the order
  const trackRes = await fetch(`${baseUrl}/orders/${createdOrderId}`);
  const trackBody = await trackRes.json();

  assert.strictEqual(trackRes.status, 200);
  assert.strictEqual(trackBody.success, true);
  assert.strictEqual(trackBody.data.orderId, createdOrderId);
  assert.strictEqual(trackBody.data.shippingAddress.fullName, 'Jane Doe');
  assert.strictEqual(trackBody.data.items[0].name, 'ORS Hydration Salts');
});

test('PATCH /api/orders/:orderId/status should update status (Admin only)', async () => {
  // Create an order
  const orderData = {
    shippingAddress: {
      fullName: 'Test Update',
      address: 'Update Street',
      city: 'Bangalore',
      country: 'India',
      zipCode: '560001'
    },
    items: [
      {
        id: 'med-paracetamol',
        name: 'Paracetamol 650mg',
        price: 40,
        quantity: 1,
        type: 'addon'
      }
    ]
  };

  const createRes = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  const createBody = await createRes.json();
  const createdOrderId = createBody.data.orderId;

  // Attempt update without token -> should fail
  const failRes = await fetch(`${baseUrl}/orders/${createdOrderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Shipped' })
  });
  assert.strictEqual(failRes.status, 401);

  // Attempt update with admin token -> should succeed
  const successRes = await fetch(`${baseUrl}/orders/${createdOrderId}/status`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'Shipped' })
  });
  const successBody = await successRes.json();

  assert.strictEqual(successRes.status, 200);
  assert.strictEqual(successBody.success, true);
  assert.strictEqual(successBody.data.status, 'Shipped');

  // Verify search status reflects update
  const trackRes = await fetch(`${baseUrl}/orders/${createdOrderId}`);
  const trackBody = await trackRes.json();
  assert.strictEqual(trackBody.data.status, 'Shipped');
});
