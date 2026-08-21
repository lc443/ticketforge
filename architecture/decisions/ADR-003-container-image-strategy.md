# ADR-003: Build once and run identical container artifacts

- Status: Accepted
- Date: 2026-08-20
- Sprint: 15

## Context

TicketForge ran three API replicas, but each service had its own build definition and depended on a JAR produced on the host. The frontend ran only through the development server, PostgreSQL data lived in a container layer, and Compose did not gate dependents on health. A successful deployment therefore depended on local machine state and could lose data when PostgreSQL was recreated.

## Decision

1. Build the Spring Boot JAR in a JDK builder stage and copy it into a JRE runtime stage.
2. Build Angular in a Node builder stage and serve only its static output from Nginx.
3. Tag one API image as `ticketforge-api:local`; run api1, api2, and api3 from that exact image.
4. Keep state outside containers: PostgreSQL uses the `ticketforge-postgres-data` named volume.
5. Add health checks and health-conditioned dependencies for infrastructure, APIs, gateway, and frontend.
6. Put the browser and API behind same-origin `/api` routing in the production frontend.
7. Bound Nginx upstream connection time and retry safe failures across replicas.
8. Supply runtime configuration through environment variables. The committed JWT value is a local-development default and must be overridden outside local development.

## Consequences

- A clean checkout can build without a pre-existing `backend/target` or `frontend/node_modules`.
- All API replicas run byte-identical application code.
- Dependency files invalidate dependency layers; ordinary source edits reuse those downloads.
- Runtime images do not contain Maven, a JDK, Node, npm, or source code.
- Database containers are disposable without making database data disposable.
- Startup waits for readiness instead of relying on container start order alone.
- Local deployment aliases should call Compose directly; a host Maven package is no longer required.

## Verification

- API context reduced from about 94 MB to 82.8 KB.
- api1, api2, and api3 reported image digest `sha256:3053f50c…923743d`.
- Frontend runtime image measured about 22 MB.
- A forced PostgreSQL recreation preserved 2 users, 2 events, and 2 reservations.
- With api2 stopped, 9 of 9 gateway requests reached a healthy replica; the first retry completed in about one second.

