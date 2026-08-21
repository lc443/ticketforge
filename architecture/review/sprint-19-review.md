# Sprint 19 architecture review

## Outcome

TicketForge now encodes persistence, application-specific health semantics, graceful termination, voluntary disruption limits, environment overlays, and reversible API delivery.

## Verified scenarios

1. A PostgreSQL canary row survived replacement of `postgres-0` because the replacement reattached the bound claim.
2. During a controlled Redis outage, API liveness stayed `UP`, readiness failed, and no API container restarted. Restoring Redis returned all three replicas to ready.
3. A deliberately nonexistent API image stalled with `ErrImagePull`; two old replicas remained available and rollback restored three replicas on the prior image.
4. Both development and production Kustomize renders passed server-side schema and admission validation.
5. The interactive Sprint 19 lab compiled in the Angular production build.

## Architecture lessons

- Persistence is a lifecycle contract, not a property of a Pod.
- Liveness answers whether restart may help; readiness answers whether traffic is safe.
- A PDB governs voluntary eviction, not every failure mode.
- Rolling back code cannot roll back data or external effects.
- StatefulSet claim templates are immutable; storage growth requires a supported operational procedure.
- An environment overlay makes differences visible, but it cannot turn a single-node development topology into production architecture.

## Evidence summary

- PostgreSQL: StatefulSet `1/1`; PVC `Bound`, 2 GiB, RWO.
- API: Deployment `3/3`; zero restarts during dependency failure.
- PDB: `minAvailable: 2`; one allowed voluntary disruption at steady state.
- Probe response: liveness `UP`; readiness reports PostgreSQL and Redis components.
- Failed release: two old replicas remained ready; emergency rollback restored three available replicas.
- Tests: 11 backend tests passed; frontend production build passed.

## Accepted limitations

- kind has one node and local-path storage; node or zone survival is unproved.
- PostgreSQL, Redis, and Kafka remain single-instance learning dependencies.
- No backup/restore drill, external secret manager, network policy, ingress/TLS, autoscaling, or multi-zone scheduling yet.
- The production image reference is intentionally a promotion placeholder.

## Next decision

Sprint 20 defines Kubernetes networking: Service and DNS flows, north-south exposure, Gateway API/Ingress tradeoffs, TLS termination, NetworkPolicy, and traffic-path evidence.

