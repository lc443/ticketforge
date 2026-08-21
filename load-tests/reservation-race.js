import http from 'k6/http';
import { check, fail } from 'k6';
import { Counter } from 'k6/metrics';
import { BASE_URL, authHeaders, login } from './lib/config.js';

const reservationsCreated = new Counter('reservations_created');
const reservationsRejected = new Counter('reservations_rejected');

export const options = {
  scenarios: {
    last_ticket: { executor: 'shared-iterations', vus: 2, iterations: 2, maxDuration: '10s' },
  },
  thresholds: { http_req_duration: ['p(95)<800'], checks: ['rate>0.99'] },
};

export function setup() {
  if (!__ENV.EVENT_ID) fail('EVENT_ID is required; use an event with exactly one ticket available');
  return { token: login(), eventId: __ENV.EVENT_ID };
}

export default function ({ token, eventId }) {
  const response = http.post(
    `${BASE_URL}/api/events/${eventId}/reservations`,
    JSON.stringify({ quantity: 1 }),
    { headers: authHeaders(token), tags: { name: 'POST /api/events/:id/reservations' } },
  );
  reservationsCreated.add(response.status === 201);
  reservationsRejected.add(response.status === 409);
  check(response, {
    'one request wins or loses cleanly': (r) => r.status === 201 || r.status === 409,
  });
}
