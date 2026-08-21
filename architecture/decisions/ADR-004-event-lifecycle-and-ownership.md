# ADR-004: Preserve reserved events through an explicit lifecycle

- Status: Accepted
- Date: 2026-08-21
- Sprint: 16

## Context

TicketForge allowed any authenticated user to create, edit, or delete any event. A capacity edit could ignore committed inventory, and deleting an event with reservations could erase the record referenced by customer and messaging workflows. Multiple users could also overwrite one another's edits without detecting stale data.

## Decision

1. The authenticated creator becomes the event organizer. The organizer or an `ADMIN` may manage the event; authenticated users may read it.
2. Existing ownerless events remain readable. Management returns `409 Conflict` until an explicit ownership-migration process assigns them; ownership is never silently claimed.
3. Events begin as `SCHEDULED`. Sprint 16 permits the idempotent transition `SCHEDULED → CANCELLED`.
4. An event with reservations cannot be hard-deleted. It must be cancelled so reservation, integration, and support history remains addressable.
5. An event without reservations may be hard-deleted.
6. Event detail changes use `PUT`; lifecycle changes use `PATCH /events/{id}/status`.
7. Capacity changes preserve sold inventory and cannot reduce total capacity below tickets already sold.
8. A JPA version column and client-supplied version reject stale edits with `409 Conflict`.
9. Create, update, cancel, and delete actions write an audit record in the same database transaction as the domain change.
10. API responses use `EventResponse` rather than exposing the `User` entity. This prevents password hashes and persistence relationships from entering the JSON contract.
11. Redis event entries use the `events-v2` cache region so replicas never deserialize older entity-shaped values as the new response DTO.

## Alternatives considered

### Always hard-delete

Simple storage behavior, but breaks referential history, customer support, and downstream references. Rejected for reserved events.

### Soft-delete with a boolean

Preserves the row but cannot express meaningful future states such as completed or postponed. An explicit status is more extensible.

### Allow ADMIN only

Easy authorization, but does not model the actual organizer relationship and creates an operational bottleneck. Organizer ownership with an administrative override fits the current product.

### Last write wins

Simpler clients, but silently loses changes. Rejected because the additional version field is small and makes conflicts visible.

## Consequences

- The API can explain forbidden, conflicting, and invalid lifecycle actions with structured errors.
- Reservation creation must check lifecycle state while holding the same event row lock used for inventory.
- The UI can show controls only to the organizer, but backend authorization remains authoritative.
- Legacy ownerless rows require a future administrator migration or ownership-assignment workflow.
- `COMPLETED` exists as a future state but no automatic transition is introduced in this sprint.

## Verification

- Ten Java 21 unit scenarios cover owner assignment, forbidden management, legacy events, inventory, stale versions, cancellation idempotency, and deletion policy.
- The Angular type contract and lifecycle views compile as part of the production frontend image.
- Docker deployment validates schema evolution and behavior across api1, api2, and api3.
