# TicketForge Load Tests

These are real k6 tests against the running TicketForge stack. They establish evidence for Sprint 3; they are not browser simulations.

## Prerequisites

Start TicketForge and create a test user. Docker can run k6 without installing it locally.

```zsh
tfup
mkdir -p load-tests/results
```

Set test credentials in the current shell (do not commit them):

```zsh
export TF_EMAIL='loadtest@example.com'
export TF_PASSWORD='replace-me'
```

## Smoke test

```zsh
docker run --rm \
  -e TF_EMAIL -e TF_PASSWORD \
  -v "$PWD/load-tests:/scripts" \
  grafana/k6 run --summary-export=/scripts/results/smoke.json /scripts/smoke.js
```

## Browse baseline

```zsh
docker run --rm \
  -e TF_EMAIL -e TF_PASSWORD -e RPS=5 -e DURATION=30s \
  -v "$PWD/load-tests:/scripts" \
  grafana/k6 run --summary-export=/scripts/results/browse.json /scripts/browse-events.js
```

The current distributed rate limiter permits 10 event requests per source IP per minute. A sustained browse test should therefore fail its 99% business-success threshold and report `rate_limited_requests`. That is a measured bottleneck, not a broken test. Sprint 3 establishes the baseline; Sprint 6 explains and tunes the protection.

## Rate-limit behavior

```zsh
docker run --rm \
  -e TF_EMAIL -e TF_PASSWORD \
  -v "$PWD/load-tests:/scripts" \
  grafana/k6 run --summary-export=/scripts/results/rate-limit.json /scripts/rate-limit.js
```

Clear the test window before repeating it:

```zsh
docker exec ticketforge-redis redis-cli --scan --pattern 'rate-limit:*'
```

## Last-ticket correctness

Create an event with exactly one available ticket, then run:

```zsh
docker run --rm \
  -e TF_EMAIL -e TF_PASSWORD -e EVENT_ID=1 \
  -v "$PWD/load-tests:/scripts" \
  grafana/k6 run --summary-export=/scripts/results/reservation-race.json /scripts/reservation-race.js
```

Expected invariant: one `201`, one `409`, and the database ends with zero—not negative—available tickets. This is destructive test traffic; use a disposable event.

## Reading results

- `http_reqs`: total traffic generated.
- `http_req_duration p(95)/p(99)`: tail latency experienced by the slowest 5%/1%.
- `business_success_rate`: requests that completed the intended business operation.
- `rate_limited_requests`: requests deliberately rejected by TicketForge.
- `reservations_created` and `reservations_rejected`: correctness outcome for the last-ticket race.

Never treat HTTP latency alone as success: a fast `429` is fast infrastructure but a failed browse operation.
