# Sprint 23 architecture review

## Outcome

TicketForge now has a safe Terraform root module and verified create, no-op, update, replacement, validation-failure, output, and destroy behavior.

## Successful evidence

- Terraform CLI `1.15.8` and signed local provider `2.9.0` were selected reproducibly.
- The provider dependency lock file records exact checksums.
- `fmt -check` and `validate` passed.
- A data source read Helm chart name and versions without duplicating them.
- The initial saved plan/apply created two managed resources.
- A repeated plan returned `No changes`.
- API capacity 3→4 changed the normalized release output.
- Capacity 1 was rejected before any resource action.
- Destroy removed exactly two resources and the generated file was absent afterward.

## Failure evidence and correction

- Homebrew core did not contain Terraform; the official HashiCorp tap was required.
- The official formula then refused installation because macOS 27 had outdated Xcode Command Line Tools. Rather than destructively replacing system tools, the sprint installed HashiCorp's precompiled ARM64 binary locally after matching its published checksum.
- Provider schema loading failed inside the restricted execution sandbox even though architecture and permissions were correct. Running the signed provider with approved subprocess access validated successfully.

## Architecture decisions

- Learn Terraform lifecycle without cloud cost or shared-resource authority.
- Read the Helm artifact as data and avoid Kubernetes ownership collision.
- Treat variables as typed configuration inputs, not a secret-management mechanism.
- Commit dependency locks while excluding state, plans, local variable files, providers, generated artifacts, and binaries.
- Review saved plans because provider lifecycle behavior can include replacement even for a small input change.

## Remaining gaps

- State is local and cannot safely coordinate multiple operators.
- There is no remote locking, encryption, versioning, or recovery workflow.
- Drift and import have not been exercised.
- The configuration is one root module rather than reusable environment modules.
- No AWS resources or costs are authorized yet.

## Next decision

Sprint 24 makes Terraform state an explicit architecture concern: remote storage, locking, sensitive-data handling, backup/recovery, drift detection, refresh-only plans, and import.
