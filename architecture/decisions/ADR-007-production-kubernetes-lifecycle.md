# ADR-007: Production Kubernetes lifecycle policy

- Status: Accepted
- Date: 2026-08-21
- Sprint: 19

## Context

Sprint 18 proved reconciliation but left PostgreSQL on ephemeral storage and treated one aggregate health endpoint as startup, readiness, and liveness. That can lose data during Pod replacement, route traffic to an unusable replica, or restart healthy processes during a shared dependency outage.

## Decision

- Run local PostgreSQL as a single-replica StatefulSet with a `ReadWriteOnce` persistent claim.
- Keep liveness limited to process state and ping; require PostgreSQL and Redis for readiness.
- Use a startup probe to protect Java initialization.
- enable Spring graceful shutdown for 25 seconds, a five-second `preStop` delay, and a 35-second Kubernetes termination grace period.
- Keep three development API replicas and require two available during voluntary disruption.
- Use Kustomize overlays: development retains three local replicas; production renders five registry-backed replicas, `maxUnavailable: 0`, and `minAvailable: 4`.
- Promote immutable image references and rehearse failed rollout recovery.

## Alternatives considered

### Put dependencies in liveness

Rejected. A Redis or database outage would restart every healthy API process without repairing the shared dependency.

### Duplicate complete manifests per environment

Rejected. Copies drift. A shared base with narrow overlays makes policy differences reviewable.

### Resize the StatefulSet claim template in the production overlay

Rejected after server validation proved the field immutable. Capacity expansion must target a supported bound PVC or use a migration plan.

### Treat the in-cluster database as production-ready

Rejected. A local-path volume and single database replica prove Pod replacement only. They do not provide node, zone, backup, restore, or disaster-recovery guarantees.

## Consequences

- Dependency failure removes API endpoints without restarting the process.
- Planned disruptions retain a declared service floor when enough replicas are healthy.
- Graceful termination reduces connection resets but increases replacement time.
- Environment policy is explicit, but the production overlay remains an architecture exercise until managed data services, secret delivery, multi-node storage, ingress, and recovery controls exist.
- Imperative `rollout undo` is an emergency tool; Git-based desired-state reversion is the preferred production recovery path.

## Evidence

- A canary row survived deletion and recreation of `postgres-0` on the same local cluster.
- The bound claim is 2 GiB, `ReadWriteOnce`, and uses the kind `standard` StorageClass.
- Liveness remained `UP` during a controlled Redis outage while readiness failed; zero API containers restarted.
- Redis recovery restored all three ready API replicas.
- A nonexistent image produced `ErrImagePull` while two old replicas stayed ready; rollback restored three available replicas on `ticketforge-api:sprint-19`.
- Development and production overlays passed Kubernetes server-side dry-run.

