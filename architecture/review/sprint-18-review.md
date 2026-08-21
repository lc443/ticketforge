# Sprint 18 architecture review

## Outcome

TicketForge API now runs as three interchangeable Kubernetes Pods behind one stable ClusterIP Service in an isolated local kind cluster.

## Requirements demonstrated

- Declare API capacity once rather than naming replicas.
- Replace a failed API Pod automatically.
- Route only to ready API endpoints.
- Separate non-sensitive configuration and credentials.
- Run application containers without root privileges or ambient Linux capabilities.
- Validate resources with the Kubernetes API before persistence.
- Preserve a clear boundary between local demonstration and production stateful architecture.

## Failure evidence

1. A stale `kind-blueprint` kubeconfig context pointed at a deleted API server.
2. Docker-to-kind loading failed for lazy multi-platform dependency content; kubelet registry pulls supplied the node architecture.
3. Pod-level non-root enforcement rejected image users without verifiable numeric IDs.
4. Kafka's controller address through an unready Service created a startup dependency cycle.
5. A read-only root filesystem prevented Tomcat from creating its temporary directory.

Each failure was diagnosed with context inspection, Pod events, `describe`, and previous-container logs before changing the manifest.

## Remediation

- Created a dedicated `kind-ticketforge` context.
- Declared numeric API UID/GID and an explicit non-root BusyBox UID/GID.
- Used `localhost:9093` for the single-process lab Kafka controller.
- Mounted a dedicated ephemeral writable volume at `/tmp` while retaining a read-only root filesystem.
- Kept application image loading explicit and allowed registry pulls for development dependencies.

## Verified evidence

- 4 of 4 Deployments available.
- 3 of 3 API replicas ready.
- 3 ready API Service endpoints.
- HTTP 200 from `/actuator/health` through the Service.
- PostgreSQL and Redis health components reported `UP`.
- One deleted API Pod was replaced and the desired replica count returned to three.

## Accepted limitations

- Single-node kind is not node-failure evidence.
- PostgreSQL data is ephemeral.
- Kafka is a single development broker.
- Secrets are local Kubernetes objects without an external secret manager.
- Frontend, gateway, ingress, TLS, network policy, autoscaling, and packaging remain outside Sprint 18.

## Next decision

Sprint 19 will define production workload behavior: persistent storage, configuration rollout, application-specific probe groups, graceful termination, disruption policy, update/rollback evidence, and environment overlays.
