# Sprint 20 architecture review

## Outcome

TicketForge now has a declared Kubernetes traffic path from one Gateway to same-origin API and frontend Services, plus TLS and least-privilege policy designs.

## Verified scenarios

1. An ephemeral in-cluster client resolved the API Service FQDN.
2. NGINX Gateway Fabric programmed a NodePort data plane from the Gateway.
3. The HTTPRoute accepted both backend references.
4. Gateway `/` returned Angular HTTP 200; `/api/events` returned structured Spring HTTP 401.
5. EndpointSlices exposed three ready API Pods and two ready frontend Pods.
6. Both environment overlays passed server-side validation.

## Failures discovered

- The Compose frontend image crashed because its NGINX config required the Compose-only `api-gateway` hostname.
- The first Kubernetes-specific image still crashed because root-oriented NGINX needed `chown` after all capabilities were dropped.
- The final image uses unprivileged NGINX on port 8080 and keeps the hardened Pod context.
- `kubectl get --raw` translated a backend 401 into a kubectl authentication message; port-forward plus curl preserved raw application evidence.

## Accepted limitations

- Sprint 20 did not run an allow/deny drill. Sprint 21 later proved enforcement when default-deny blocked a load Pod and a narrow allow policy restored only its API path.
- TLS references an external Secret and example hostname; certificate issuance/renewal is not installed.
- Local NodePort access uses port-forward because the original kind cluster lacks a host port mapping.
- Internal gateway-to-service traffic is plaintext.
- No external DNS, cloud load balancer, WAF, rate limit at edge, or multi-zone path test exists yet.

## Next decision

Sprint 21 addresses autoscaling: metrics availability, CPU versus demand signals, HPA behavior, resource requests, load generation, stabilization, and cost/capacity evidence.
