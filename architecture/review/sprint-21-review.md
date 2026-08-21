# Sprint 21 architecture review

## Outcome

TicketForge has a bounded API HPA with measured resource requests and verified scale-out/scale-in behavior.

## Successful evidence

- Metrics Server v0.8.1 exposed node and Pod resource observations.
- Corrected idle utilization was 4% with three API replicas.
- A policy-aware load drill crossed the target and scaled 3→4.
- Four replicas became ready and redistributed load to 37% average CPU.
- Removing demand returned the API 4→3 at 2% CPU.
- The final cluster retained three healthy API replicas.

## Failure evidence

- A 100m CPU request produced approximately 645% utilization.
- The initial 3→6 scale-out drove kind node usage to roughly 12.5 CPU cores.
- API, PostgreSQL, CoreDNS, scheduler, controller manager, and API-server probes/leases failed.
- Manual scaling raced the still-active HPA; recovery required deleting the live HPA first.
- Default-deny blocked the first load generator until a narrow allow policy was added.
- Public API load hit HTTP 429; excessive BusyBox workers exceeded a 64Mi limit and were OOM-killed.

## Corrective decisions

- API CPU request: 500m.
- Development HPA: min 3, max 4, target 70%.
- Load endpoint: internal health path, isolated exercise resources.
- Production 5–10 policy remains render-only until multi-node capacity evidence exists.

## Next decision

Sprint 22 packages the growing Kubernetes resource set with Helm while preserving schema validation, environment values, immutable promotion inputs, and rollback behavior.

