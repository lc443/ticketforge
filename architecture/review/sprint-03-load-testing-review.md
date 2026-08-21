# Sprint 3 Review — Load Testing

## What it is

Load testing generates controlled traffic against a running system and measures throughput, latency, failures, and business correctness. A functional test asks whether one request works; a load test asks whether the operation still works repeatedly and concurrently.

## TicketForge's problem

TicketForge already claimed benefits from horizontal scaling, Redis, rate limiting, locking, and Kafka, but had no real traffic baseline. The previous lab displayed invented metrics, so there was no evidence showing the system's actual limit or whether a fast response represented a successful user operation.

## The solution

The `load-tests/` suite runs reproducible k6 scenarios through NGINX:

- `smoke.js`: verifies login and event listing before generating load.
- `browse-events.js`: generates a configurable arrival rate and separates HTTP latency from business success.
- `rate-limit.js`: verifies accepted requests and structured `429` responses.
- `reservation-race.js`: sends two simultaneous requests for a disposable last ticket and measures one winner/one clean rejection.

Every scenario defines thresholds. Results can be exported as JSON for comparison and for the interactive lab.

## Baseline run — August 20, 2026

Environment: local Docker Compose stack, NGINX, three Spring Boot replicas, PostgreSQL, Redis, and Kafka.

### Smoke

- 2 HTTP requests (login plus event listing)
- 100% checks passed
- 0% HTTP failures
- p95: 413.21 ms

### Browse

Traffic: 5 event-list requests/second for 10 seconds.

- 51 total HTTP requests, including setup login
- 50 event-list operations
- 10 successful event-list operations
- 40 `429 Too Many Requests` responses
- 20% business success
- HTTP p95: 16.51 ms
- HTTP p99: 275.45 ms

The `business_success_rate > 99%` threshold failed, as it should.

## What we learned

The first measured wall was not CPU, PostgreSQL, Redis latency, Kafka, or NGINX. It was the intentional Sprint 6 policy of 10 event requests per source IP per minute. Because all k6 traffic originated from one Docker client address, Redis applied one shared counter across all three API replicas.

The API returned most rejections quickly, producing a low p95 while failing 80% of user operations. Therefore:

> Low latency does not prove a system is healthy. Measure business success separately from transport performance.

## Tradeoffs and next experiment

The rate limiter is functioning as implemented, but an IP-only limit of 10/minute on every `/api/events` route is too coarse for realistic browsing and can group many users behind one NAT address. A future tuning experiment should distinguish anonymous/IP limits from authenticated-user limits, configure limits per operation, and then rerun the same k6 scenario to reveal the next bottleneck.

Sprint 3 is complete because real tests ran, thresholds produced a meaningful failure, the bottleneck was identified, and the lab now uses measured rather than invented evidence.
