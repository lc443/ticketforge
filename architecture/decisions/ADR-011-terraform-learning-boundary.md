# ADR-011: Terraform fundamentals learning boundary

- Status: Accepted
- Date: 2026-08-21
- Sprint: 23

## Context

TicketForge has reproducible application containers, Kubernetes resources, and a Helm package, but infrastructure creation still depends on operators following imperative commands. The curriculum needs to teach Terraform's configuration graph and full lifecycle before adding cloud credentials, cost, remote-state coordination, or production blast radius.

## Decision

- Create an isolated root module at `infrastructure/terraform/fundamentals`.
- Pin Terraform to compatible `1.15.x` releases and the HashiCorp local provider to compatible `2.x` releases from `2.6` onward.
- Commit `.terraform.lock.hcl` so the exact selected provider and checksums are reproducible.
- Read the existing Helm `Chart.yaml` through a data source rather than duplicating its version metadata.
- Use typed variables with validation for environment, owner, planned region, and API capacity.
- Derive shared labels, endpoints, and the normalized catalog with locals.
- Manage a disposable JSON environment catalog plus a built-in `terraform_data` release contract.
- Ignore provider binaries, local state, saved plans, generated catalogs, and local variable values.
- Require format, validation, saved-plan apply, no-op plan, valid update, invalid-input failure, and destroy evidence.

## Alternatives

### Provision AWS immediately

Rejected for this sprint. It mixes Terraform fundamentals with credentials, cost, IAM, networking, state bootstrap, and destructive cloud authority before those architecture decisions are learned.

### Manage the existing kind cluster with Terraform

Rejected. Helm/Kustomize currently own those resources. Introducing a second manager would create an ownership conflict rather than a clean Terraform lesson.

### Use only the built-in `terraform_data` resource

Rejected. It avoids provider installation but does not demonstrate provider source/version selection, a data source, or an externally observable managed resource.

## Consequences

- The sprint proves Terraform mechanics without billable or shared infrastructure.
- The generated catalog is a learning artifact, not a production environment.
- Local state is deliberately temporary and unsuitable for collaboration; Sprint 24 addresses state storage, locking, drift, and import.
- A compatible provider constraint can select a newer minor release; the committed lock file fixes the actual selected version until intentionally upgraded.

## Evidence

- Terraform `1.15.8` archive checksum matched HashiCorp's published SHA-256 value.
- Initialization installed signed `hashicorp/local v2.9.0` and created the dependency lock file.
- Format and configuration validation passed.
- Initial saved plan/apply created two resources; a second plan reported no changes.
- Changing API capacity 3→4 updated `terraform_data` in place and replaced the content-addressed local file.
- Capacity 1 failed the variable availability constraint.
- Destroy removed both managed resources and the catalog no longer existed.
