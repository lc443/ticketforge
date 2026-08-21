import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, authHeaders, login } from './lib/config.js';

export const options = {
  vus: 1,
  iterations: 12,
  thresholds: { checks: ['rate>0.95'] },
};

export function setup() { return { token: login() }; }

export default function ({ token }) {
  const response = http.get(`${BASE_URL}/api/events`, {
    headers: authHeaders(token), tags: { name: 'GET /api/events (rate-limit probe)' },
  });
  check(response, {
    'request is accepted or deliberately limited': (r) => r.status === 200 || r.status === 429,
    '429 has the API error contract': (r) => r.status !== 429 || r.json('status') === 429,
  });
}
