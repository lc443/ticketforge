import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, authHeaders, login } from './lib/config.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export function setup() { return { token: login() }; }

export default function ({ token }) {
  const response = http.get(`${BASE_URL}/api/events`, {
    headers: authHeaders(token), tags: { name: 'GET /api/events' },
  });
  check(response, {
    'events returns 200': (r) => r.status === 200,
    'events returns an array': (r) => Array.isArray(r.json()),
  });
}
