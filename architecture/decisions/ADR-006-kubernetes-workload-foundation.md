# ADR-006: Kubernetes workload foundation

- Status: Accepted
- Date: 2026-08-21
- Sprint: 18

## Context

Docker Compose represents TicketForge API capacity as three manually named containers and the gateway names every replica. That topology is appropriate for learning container fundamentals but couples scaling, discovery, replacement, and deployment to one Docker host.

Sprint 18 needs to demonstrate Kubernetes reconciliation without falsely presenting local, single-node data services as production architecture.

## Decision

Run a dedicated local kind cluster named `ticketforge` and deploy:

- one namespaced API Deployment with three replicas;
- one ClusterIP Service selecting ready API Pods by stable labels;
- ConfigMap and Secret references for runtime configuration boundaries;
- startup, readiness, and liveness probes;
- numeric non-root identities, dropped capabilities, privilege-escalation prevention, and a read-only root filesystem;
- a dedicated writable `emptyDir` mounted only at `/tmp` for Tomcat;
- resource requests and limits;
- single-replica PostgreSQL, Redis, and Kafka development dependencies.

Kustomize composes the checked-in base manifests. Local Secret values remain outside Git. The API image is loaded into kind's containerd runtime rather than rebuilt by Kubernetes.

## Alternatives considered

### Keep Docker Compose

Rejected for this sprint because it cannot demonstrate Kubernetes controllers, scheduling, Services, EndpointSlices, or probe-driven availability.

### Deploy every user-facing component immediately

Deferred. Adding frontend, gateway, ingress, TLS, and external routing at once would obscure the workload and reconciliation fundamentals that Sprint 18 is intended to prove.

### Treat development dependencies as production workloads

Rejected. PostgreSQL currently uses `emptyDir`, Kafka is a one-node broker, and the cluster is a one-node kind environment. Production storage, recovery, disruption, and multi-node placement require explicit later decisions.

## Consequences

- API replica identity is disposable; labels and controllers replace fixed names.
- Service DNS decouples clients from Pod IP churn.
- Local deployment is reproducible from manifests plus a separately created Secret.
- Deleting the PostgreSQL Pod loses lab data by design.
- kind image loading introduces a distinct Docker-to-containerd artifact-transfer step.
- Sprint 19 must address production workload policy, persistent storage, safer configuration rollout, and rollback behavior.

## Evidence

- All manifests passed Kubernetes server-side dry-run.
- PostgreSQL, Redis, Kafka, and three API replicas became ready.
- The API Service exposed three ready EndpointSlice addresses.
- Service port-forward returned HTTP 200 with database and Redis health `UP`.
- Deleting one API Pod produced a new Pod name and IP and restored three ready replicas.
