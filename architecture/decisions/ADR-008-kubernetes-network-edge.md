# ADR-008: Kubernetes network edge and traffic policy

- Status: Accepted
- Date: 2026-08-21
- Sprint: 20

## Context

TicketForge Services provide stable in-cluster discovery, but `ClusterIP` is not a public entry point and `kubectl port-forward` is only a debugging tunnel. The platform needs one edge, same-origin web/API routing, TLS ownership, and explicit workload communication rules.

## Decision

- Use Gateway API standard resources with NGINX Gateway Fabric as the implementation.
- Route `/api` to `ticketforge-api:8080` and `/` to `ticketforge-frontend:80` using one `HTTPRoute`.
- Run two hardened, unprivileged frontend replicas that serve only static Angular content; Gateway API owns Kubernetes edge routing.
- Keep Services and cluster DNS for east-west discovery.
- Terminate production TLS at the Gateway using a separately supplied certificate Secret.
- Declare default-deny ingress and narrowly allow gateway-to-web/API plus API-to-data flows.

## Alternatives

### Legacy Ingress

Viable but not selected. Gateway API provides clearer infrastructure/application ownership, typed listeners, richer status, and an explicit migration path for future traffic policy.

### Service type LoadBalancer for every workload

Rejected because it expands public surface area, cost, certificate management, and policy duplication.

### Keep API proxying inside frontend NGINX

Rejected for Kubernetes. It duplicated edge ownership and the Compose-only `api-gateway` DNS name caused frontend crash loops. Kubernetes frontend NGINX now serves static content only.

## Consequences

- Browser API calls remain same-origin, avoiding a new CORS boundary.
- Gateway controller installation is a platform prerequisite and must be version-managed separately.
- TLS termination protects north-south traffic; internal plaintext remains an explicit future decision.
- NetworkPolicy manifests are portable intent, but proof requires an enforcing CNI. kindnet does not provide that evidence.

## Evidence

- Gateway `Programmed=True`; HTTPRoute `Accepted=True` and `ResolvedRefs=True`.
- Cluster DNS resolved `ticketforge-api.ticketforge.svc.cluster.local` to its ClusterIP.
- `/` through the gateway returned Angular with HTTP 200.
- `/api/events` through the same gateway returned Spring's structured HTTP 401 response.
- EndpointSlices contained three API endpoints and two frontend endpoints.
- Development and production overlays passed server-side validation.

