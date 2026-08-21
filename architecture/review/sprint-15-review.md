# Sprint 15 Review: Docker

## What this sprint is

Docker packages an application and its runtime filesystem as an immutable image. A container is a running instance of that image. TicketForge now treats images as deployment artifacts, containers as disposable processes, and volumes as the home for durable state.

## Problem

The previous stack looked containerized but was not reproducible end to end. The API copied a host-built JAR, three replicas had separate image builds, the frontend was absent from Compose, startup used ordering instead of readiness, and PostgreSQL had no persistent volume. The first clean frontend build also revealed an undeclared peer-dependency install policy and outdated CSS budgets.

## Sprint solution

- Added multi-stage API and frontend Dockerfiles.
- Added a root `.dockerignore` to keep generated files out of build contexts.
- Made clean npm installs reproduce the lockfile policy explicitly.
- Made Angular use `/api`, with a development proxy and a production Nginx proxy.
- Made three replicas consume one shared API image.
- Added health checks and health-gated startup.
- Added a persistent PostgreSQL named volume and migrated existing local data through a validated custom-format dump.
- Added bounded Nginx failover behavior.
- Externalized the JWT signing secret while retaining a local-only default.

## Evidence

| Invariant | Result |
|---|---|
| Clean API build context excludes generated output | 82.8 KB, previously about 94 MB |
| One artifact runs on every API replica | All three containers used the same image digest |
| Production frontend is a runtime image | Angular built successfully; Nginx image about 22 MB |
| Dependencies start before consumers | PostgreSQL, Redis, Kafka, APIs, and gateway passed health gates |
| API error bodies survive the frontend proxy | `/api/events` returned structured 401 JSON with its message |
| Database state survives container replacement | Users/events/reservations counts remained 2/2/2 |
| One failed API does not cause an outage | 9/9 requests received upstream responses with api2 stopped |

## Findings carried forward

- `lucide-angular@1.0.0` is deprecated and does not declare Angular 22 support. The lockfile is reproducible through `legacy-peer-deps`; migrate to `@lucide/angular` in a dependency-maintenance sprint.
- Kafka lab CSS is 17.65 KB and now warns against a 12 KB component budget. It should be refactored before exceeding the 20 KB error threshold.
- The existing `tfdeploylocal` alias still packages the backend on the host. It should be shortened to invoke `tfbuild`, because Docker now owns compilation.

## Outcome

Sprint 15 is complete. TicketForge has a reproducible local deployment unit suitable for the Sprint 16 CI/CD pipeline.

