# ADR-009: Bounded API autoscaling

- Status: Accepted
- Date: 2026-08-21
- Sprint: 21

## Context

Three fixed API replicas cannot adapt to demand. However, an initial 100m CPU request made normal usage appear above 500%, and an HPA scale-out to six replicas saturated the single kind node, destabilizing applications and control-plane components.

## Decision

- Use `autoscaling/v2` CPU utilization for the API only.
- Set the API CPU request to the measured 500m baseline and retain the 750m limit.
- Development uses 3–4 replicas, 70% CPU, immediate bounded scale-up, and 120-second scale-down stabilization.
- Production renders 5–10 replicas, 60% CPU, and 300-second scale-down stabilization, but requires multi-node capacity validation before use.
- Install pinned Metrics Server v0.8.1 as a platform prerequisite. The kind-only kubelet TLS exception is not production policy.
- Keep the reproducible load Pod and its narrow NetworkPolicy under `infrastructure/kubernetes/exercises`.

## Alternatives

### Memory utilization

Deferred. JVM memory may remain high after demand falls and can produce weak scale-in signals.

### Request-rate/custom metrics

Preferred future evolution for workload demand, but requires a Prometheus/custom-metrics pipeline not yet present.

### Scale frontend and API together

Rejected. Static NGINX and Spring have different bottlenecks; coupled scaling wastes capacity.

## Consequences

- HPA owns the live Deployment replica count while active; operators should not manually scale it.
- Replica ceilings are capacity and cost controls, not demand guarantees.
- Per-replica background work and dependency connection pools must be included in capacity models.
- HPA cannot add nodes; production needs scheduling headroom or Cluster Autoscaler/Karpenter.

## Evidence

- Metrics API became available and returned node/Pod CPU.
- Initial 100m request reported 645% utilization; 3→6 caused node/control-plane failure.
- Corrected 500m request produced a 4% idle baseline.
- Policy-aware health load triggered 3→4; all four Pods became ready and average CPU fell to 37%.
- Removing load and its allow policy returned the Deployment 4→3 at 2% utilization.

