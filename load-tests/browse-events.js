import http from 'k6/http';
import { check } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import { BASE_URL, authHeaders, login } from './lib/config.js';

const rateLimited = new Counter('rate_limited_requests');
const successful = new Rate('business_success_rate');

export const options = {
  scenarios: {
    browse: {
      executor: 'constant-arrival-rate',
      rate: Number(__ENV.RPS || 5),
      timeUnit: '1s',
      duration: __ENV.DURATION || '30s',
      preAllocatedVUs: Number(__ENV.VUS || 10),
      maxVUs: Number(__ENV.MAX_VUS || 50),
    },
  },
  thresholds: {
    business_success_rate: ['rate>0.99'],
    http_req_duration: ['p(95)<300', 'p(99)<500'],
  },
};

export function setup() { return { token: login() }; }

export default function ({ token }) {
  const response = http.get(`${BASE_URL}/api/events`, {
    headers: authHeaders(token), tags: { name: 'GET /api/events' },
  });
  rateLimited.add(response.status === 429);
  successful.add(response.status === 200);
  check(response, { 'events returns 200': (r) => r.status === 200 });
}
