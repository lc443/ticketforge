# ADR-010: Helm application-plane packaging

- Status: Accepted
- Date: 2026-08-21
- Sprint: 22

## Context

TicketForge's Kubernetes base and environment overlays now describe Deployments, Services, configuration, disruption budgets, autoscaling, Gateway routes, and network policy. Copying or directly editing this resource set for every environment increases drift risk and provides no release-level history.

Packaging everything together would create a different risk: a stateless application rollback could accidentally couple durable data, cluster controllers, credentials, and certificate infrastructure to the application's deployment lifecycle.

## Decision

- Package the API, frontend, Services, ConfigMap, HPA, PDB, Gateway/HTTPRoute, NetworkPolicy, and chart test in `infrastructure/helm/ticketforge`.
- Keep PostgreSQL, Redis, Kafka, Gateway controller, Metrics Server, TLS issuance, and Secret creation as explicit platform/data prerequisites.
- Version the chart independently from `appVersion` so packaging changes and application releases remain distinguishable.
- Use `values.yaml` for development defaults and `values-production.yaml` for production policy differences.
- Enforce the public values contract with `values.schema.json`, including unknown-field rejection and replica/CPU bounds.
- Require lint, environment rendering, Kubernetes server-side dry-run, and an intentional schema failure before promotion.
- Use `helm upgrade --install --atomic --wait` for deployment and a dedicated namespace during migration from Kustomize ownership.
- Run the Helm test hook through a narrowly scoped NetworkPolicy while default-deny remains active.

## Alternatives

### Continue with Kustomize only

Kustomize remains useful for composition, but it does not provide Helm release revisions, hooks, chart packaging, or a values schema. Existing overlays remain migration/reference assets rather than being deleted in this sprint.

### Package the entire platform in one chart

Rejected. Stateful services, controllers, credentials, and certificates have different operators, blast radii, upgrade procedures, and recovery requirements.

### Use a third-party chart dependency for every data service

Deferred. It would demonstrate chart dependencies but obscure the architecture boundary and introduce upstream lifecycle decisions before TicketForge defines its production data platform.

## Consequences

- One template set now produces environment-specific application policy without copied manifests.
- Schema validation catches configuration mistakes before they reach Kubernetes.
- Helm owns only resources created by its release; adopting existing Kustomize-managed resources requires a deliberate migration.
- Helm rollback restores Kubernetes release state, not database migrations, emitted messages, or other external side effects.
- Production image references remain placeholders until the artifact promotion pipeline supplies immutable digests.

## Evidence

- Default and production values passed `helm lint` and `helm template`.
- Both rendered manifests passed Kubernetes server-side dry-run.
- `maxReplicas=0` failed schema validation as designed.
- Disposable release revisions proved install, upgrade, history, and rollback.
- The chart test returned `healthy` with default-deny enabled and only its narrow frontend ingress allowance.
