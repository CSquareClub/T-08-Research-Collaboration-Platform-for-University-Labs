const { test, describe, before } = require('node:test');
const assert = require('node:assert');

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000';

describe('ResearchHub API Integration Test Suite', () => {
  let authToken = null;
  const testUser = {
    name: 'CUSoC Evaluator Test',
    email: `evaluator_${Date.now()}@researchhub.edu`,
    password: 'password123',
    role: 'Student',
    department: 'Computer Science'
  };

  test('TC01 - Health Check endpoint responds successfully', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('ResearchHub API is running'));
  });

  describe('Authentication & Validation Tests', () => {
    test('TC02 - Registration fails when name is missing (400 Bad Request)', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'noname@test.com', password: 'password123' })
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.ok(data.errors && data.errors.length > 0);
    });

    test('TC03 - Registration fails with invalid email format (400 Bad Request)', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', email: 'invalid-email', password: 'password123' })
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.ok(data.errors && data.errors.some(e => e.msg.includes('valid email')));
    });

    test('TC04 - Registration fails with short password < 6 chars (400 Bad Request)', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', email: 'shortpw@test.com', password: '123' })
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.ok(data.errors && data.errors.some(e => e.msg.includes('6 or more characters')));
    });

    test('TC05 - Login fails with invalid credentials (400 Bad Request)', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nonexistent_user_999@test.com', password: 'wrongpassword' })
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.strictEqual(data.message, 'Invalid credentials');
    });
  });

  describe('Security & Route Protection Tests (JWT Authorization Guard)', () => {
    test('TC06 - GET /api/users/me without token is rejected (401 Unauthorized)', async () => {
      const res = await fetch(`${BASE_URL}/api/users/me`);
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.strictEqual(data.message, 'No token, authorization denied');
    });

    test('TC07 - GET /api/projects without token is rejected (401 Unauthorized)', async () => {
      const res = await fetch(`${BASE_URL}/api/projects`);
      assert.strictEqual(res.status, 401);
    });

    test('TC08 - POST /api/projects without token is rejected (401 Unauthorized)', async () => {
      const res = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Unauthorized Project' })
      });
      assert.strictEqual(res.status, 401);
    });

    test('TC09 - GET /api/collaboration-requests without token is rejected (401 Unauthorized)', async () => {
      const res = await fetch(`${BASE_URL}/api/collaboration-requests`);
      assert.strictEqual(res.status, 401);
    });

    test('TC10 - GET /api/datasets without token is rejected (401 Unauthorized)', async () => {
      const res = await fetch(`${BASE_URL}/api/datasets`);
      assert.strictEqual(res.status, 401);
    });

    test('TC11 - GET /api/publications without token is rejected (401 Unauthorized)', async () => {
      const res = await fetch(`${BASE_URL}/api/publications`);
      assert.strictEqual(res.status, 401);
    });
  });

  describe('End-to-End User Lifecycle & Data Retrieval Flow', () => {
    test('TC12 - User can register successfully and receives valid JWT token', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(data.token, 'Response should contain a JWT token');
      assert.strictEqual(data.user.name, testUser.name);
      assert.strictEqual(data.user.role, testUser.role);
      authToken = data.token;
    });

    test('TC13 - Registered user can log in and receives JWT token', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(data.token);
      assert.strictEqual(data.user.name, testUser.name);
    });

    test('TC14 - Authenticated user can fetch their personal profile via /api/users/me', async () => {
      assert.ok(authToken, 'Auth token must be present');
      const res = await fetch(`${BASE_URL}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      assert.strictEqual(res.status, 200);
      const profile = await res.json();
      assert.strictEqual(profile.email, testUser.email);
      assert.strictEqual(profile.name, testUser.name);
      assert.strictEqual(profile.passwordHash, undefined, 'passwordHash must never be exposed');
    });

    test('TC15 - Authenticated user can fetch projects list (/api/projects)', async () => {
      assert.ok(authToken, 'Auth token must be present');
      const res = await fetch(`${BASE_URL}/api/projects`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      assert.strictEqual(res.status, 200);
      const projects = await res.json();
      assert.ok(Array.isArray(projects), 'Response must be an array');
    });

    test('TC16 - Authenticated user can fetch datasets list (/api/datasets)', async () => {
      assert.ok(authToken, 'Auth token must be present');
      const res = await fetch(`${BASE_URL}/api/datasets`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      assert.strictEqual(res.status, 200);
      const datasets = await res.json();
      assert.ok(Array.isArray(datasets), 'Response must be an array');
    });

    test('TC17 - Authenticated user can fetch publications list (/api/publications)', async () => {
      assert.ok(authToken, 'Auth token must be present');
      const res = await fetch(`${BASE_URL}/api/publications`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      assert.strictEqual(res.status, 200);
      const publications = await res.json();
      assert.ok(Array.isArray(publications), 'Response must be an array');
    });
  });
});
