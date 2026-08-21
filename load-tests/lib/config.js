import http from 'k6/http';
import { check, fail } from 'k6';

export const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8080';

export function login() {
  const email = __ENV.TF_EMAIL;
  const password = __ENV.TF_PASSWORD;
  if (!email || !password) fail('TF_EMAIL and TF_PASSWORD are required');

  const response = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'POST /api/auth/login' } },
  );

  check(response, { 'login succeeds': (r) => r.status === 200 });
  if (response.status !== 200) fail(`Login failed (${response.status}): ${response.body}`);
  return response.json('token');
}

export function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}
