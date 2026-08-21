# ADR-002: Use PostgreSQL Row Locks for Reservation Inventory

- **Status:** Accepted
- **Date:** 2026-08-20
- **Decision owners:** TicketForge

## Context

TicketForge runs three stateless Spring Boot API replicas behind NGINX. Concurrent reservation requests can reach different JVMs while modifying the same event inventory. A JVM-local mechanism such as `synchronized` cannot coordinate those replicas.

The inventory row, reservation row, and transactional-outbox row are all stored in PostgreSQL and must commit atomically. Redis is available in the architecture for caching and rate limiting, which makes a Redis lease lock technically possible.

## Decision

TicketForge will use a PostgreSQL pessimistic write lock on the event row while checking and decrementing inventory:

```sql
SELECT * FROM events WHERE id = ? FOR UPDATE;
```

The lock, protected state, reservation write, and outbox write remain inside one database transaction. Redis will not be used as an additional inventory lock authority.

## Alternatives considered

### JVM-local `synchronized`

Rejected. Each replica owns an independent lock, so requests handled by different replicas can enter the critical section simultaneously.

### Redis lease lock

Rejected for the current boundary. It would coordinate replicas but split coordination and data across Redis and PostgreSQL. Correctness would then depend on lease duration, ownership-safe release, Redis availability, process pauses, network partitions, and potentially fencing stale lock holders.

### Optimistic database locking

Not selected for the current last-ticket workload. It can improve throughput when conflicts are rare, but flash-sale inventory is intentionally contention-heavy and would require retry behavior. It remains a valid future experiment.

## Consequences

### Positive

- Correct across every API replica sharing PostgreSQL.
- Inventory, reservation, and outbox changes commit or roll back together.
- No second coordination system or lock lease is required.
- Failure behavior follows the existing database transaction model.

### Negative

- Requests for the same event serialize.
- Hot events can increase lock waits and p95/p99 latency.
- Long transactions reduce throughput and increase deadlock risk.
- Database availability is required for reservations.

## Verification

On August 20, 2026, k6 sent two concurrent one-ticket reservation requests through NGINX while all three API replicas were running. Results:

- one `201 Created`
- one `409 Conflict`
- one reservation row
- zero tickets remaining
- p95 request latency: 261.16 ms

The no-overselling invariant held.

## Revisit when

- Inventory moves outside PostgreSQL.
- A workflow must coordinate several resources without one transactional owner.
- Measured database lock contention violates the reservation latency objective.
- Optimistic concurrency or queue-based admission control is evaluated with real traffic.
