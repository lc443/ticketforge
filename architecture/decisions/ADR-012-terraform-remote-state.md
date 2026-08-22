# ADR-012: Terraform remote-state architecture

- Status: Accepted
- Date: 2026-08-21
- Sprint: 24

## Context

Sprint 23 proved Terraform's resource lifecycle with local state. A local file cannot coordinate engineers or pipelines, survives only as well as one workstation, and provides no shared lock or recovery history. TicketForge also needs to adopt infrastructure that already exists and detect changes made outside Terraform.

## Quality attributes and assumptions

- One authoritative state key must map configuration addresses to real identities.
- Concurrent writers must fail safely rather than overwrite one another.
- Completed state writes must be recoverable from immutable object history.
- Credentials must not be committed in backend configuration or saved plans.
- The local exercise must create no cloud bill and must bind only to loopback.
- The production design must add cloud IAM, TLS, KMS, audit logging, retention, replication, and tested restore objectives.

## Decision

- Use Terraform's S3 backend with `use_lockfile = true`.
- Simulate S3 locally with pinned LocalStack `4.14.0`; it is training infrastructure, not a production availability claim.
- Bootstrap a dedicated `ticketforge-terraform-state` bucket with object versioning and AES-256 server-side encryption metadata.
- Keep the backend declaration partial and pass local endpoint settings through `backend.local.hcl`.
- Supply credentials through environment variables because Terraform copies backend configuration into `.terraform/` and plan artifacts.
- Use one namespaced key: `ticketforge/state-lab/terraform.tfstate`.
- Prove import, drift repair, lock contention, version history, no-op reconciliation, and ordered teardown.
- Treat state as sensitive operational data even when this exercise contains no secrets.

## Alternatives

### Continue with local state

Rejected. It cannot safely coordinate multiple writers and makes backup, access policy, and recovery an individual workstation concern.

### S3 plus DynamoDB locking

Rejected for new work. Terraform's S3 backend supports native lockfiles, while DynamoDB-based locking is deprecated. A migration may temporarily configure both mechanisms when older clients still participate.

### Terraform Cloud or HCP Terraform

Viable for managed state, policy, remote execution, and reduced operational burden. Deferred so this sprint exposes the storage, locking, and recovery mechanics directly before evaluating a managed control plane.

### MinIO for the local S3 simulation

Rejected because its upstream repository was archived. The chosen LocalStack release is pinned to keep the exercise reproducible, but its licensing and release model must be reevaluated before future upgrades.

## Consequences

- Team operations share one ownership map and conflicting writers receive actionable lock information.
- Object history creates recovery points but also expands sensitive-data retention.
- The backend has its own bootstrap lifecycle and cannot depend on the state it stores.
- S3-compatible local behavior does not prove AWS durability, IAM, KMS, TLS, replication, or regulatory controls.
- Import establishes ownership; it does not prove configuration matches the imported object.
- Applying a refresh-only plan accepts reality into state, while applying a normal plan usually restores declared intent. The operator must choose deliberately.

## Production evolution

Before AWS use, place the state bucket in a dedicated administrative account, block public access, require TLS, use a customer-managed KMS key, apply least-privilege roles, log data access, add retention and replication appropriate to RPO/RTO, and rehearse recovery. Backend deletion must require a separate break-glass workflow.

## Evidence

- The loopback-only LocalStack backend became healthy and created the versioned, encrypted bucket.
- Remote initialization selected `hashicorp/local v2.9.0` and `hashicorp/kubernetes v2.38.0`.
- An unmanaged Kubernetes namespace appeared as a proposed create until import mapped its identity.
- After import, Terraform proposed an in-place label reconciliation rather than creation.
- A manual file edit was detected; the reviewed repair restored intent and the next plan reported no changes.
- During a 20-second apply, a second plan timed out after three seconds with `412 PreconditionFailed` and lock-owner metadata.
- The first writer completed, released the lock, and a subsequent plan succeeded.
- Fourteen state-object versions existed after the lifecycle exercises, proving a recoverable history was recorded.
