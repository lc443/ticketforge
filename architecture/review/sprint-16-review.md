# Sprint 16 Review: Event Lifecycle & API Evolution

## What this sprint is

Sprint 16 turns event management from CRUD into a governed business lifecycle. The implementation treats ownership, committed inventory, historical records, concurrent editing, caches, and support evidence as parts of one design.

## Scenario

Alice creates an event and becomes its organizer. Customers reserve tickets. Bob may view the event but cannot edit or cancel it. If Alice cancels it, existing reservations remain, new reservations stop, and support can see who made the change and when. If two copies of the edit page are open, the older copy cannot overwrite a newer save.

## Solution

- Added organizer ownership with an ADMIN override.
- Added `SCHEDULED`, `CANCELLED`, and future `COMPLETED` lifecycle states.
- Preserved sold-ticket counts during edits and rejected capacity below committed inventory.
- Added explicit cancellation through PATCH and restricted hard deletion to unreserved events.
- Added optimistic versions for stale-edit detection while retaining row locks for inventory serialization.
- Added transactional audit history.
- Added response DTOs so persistence entities and user secrets do not become the API contract.
- Versioned Redis cache entries for safe multi-replica rollout.
- Updated the organizer UI with status, cancellation, guarded controls, structured errors, and audit history.

## Evidence

| Invariant | Evidence |
|---|---|
| Creator owns the event | Unit scenario asserts organizer assignment |
| Another user cannot manage it | Structured 403 scenario |
| Sold inventory cannot be erased | Capacity-below-sold returns 409 |
| Concurrent edits do not silently overwrite | Stale version returns 409 |
| Cancellation preserves history | Status transition plus audit record |
| Repeated cancellation is harmless | No second audit record |
| Reserved event cannot be deleted | Delete returns 409 |
| Cancelled event cannot sell tickets | Reservation service rejects before inventory mutation |
| Replicas do not consume stale cached entity shapes | Cache namespace moved to `events-v2` |

## Tradeoffs and follow-up

- Hibernate currently evolves the local schema. Production should replace this with reviewed Flyway migrations and an explicit owner backfill.
- The JWT does not carry role claims. The UI can identify an organizer but cannot independently display ADMIN controls; the API still enforces the override.
- A delete audit survives because it stores the scalar event ID rather than a foreign key. This favors support history over relational cascading.
- Automatic completion, postponement, refunds, customer notifications, and ownership transfer are intentionally future lifecycle work.
- Deployment logs exposed a pre-existing outbox defect on every replica: PostgreSQL large-object payloads are read by the scheduler in auto-commit mode. Event lifecycle endpoints remain healthy, but Kafka delivery needs a transactional query or a non-LOB text mapping before it can be considered operationally healthy.

## Outcome

Sprint 16 is complete after Docker build, three-replica deployment, API failure-path checks, and UI verification pass. Sprint 17 can now automate these quality gates in CI/CD.
