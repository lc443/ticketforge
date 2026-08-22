# Sprint 24 architecture review

## Outcome

TicketForge moved Terraform identity from one workstation into a shared, locked, versioned S3-compatible backend and proved adoption, drift, contention, and recovery evidence.

## Successful evidence

- LocalStack `4.14.0` ran healthy on loopback only.
- Bucket versioning and AES-256 server-side encryption metadata were enabled automatically.
- Remote initialization selected locked local and Kubernetes providers.
- An existing namespace remained unmanaged until `terraform import` bound its ID to the declared address.
- The post-import plan reconciled labels in place instead of recreating the namespace.
- Manual drift was visible in refresh-only and normal plans; the normal repair restored declared intent.
- A second writer timed out safely with S3 `412 PreconditionFailed` while a 20-second apply owned the lock.
- Lock metadata identified the state path, operation, owner, Terraform version, and creation time.
- The first writer completed and a subsequent plan reported no changes.
- Fourteen historical state-object versions were recorded during the exercise.

## Failure evidence and correction

- A truncated command result initially made drift-repair completion uncertain. Direct inspection of the generated artifact, state addresses, and a no-op plan replaced assumption with evidence.
- Before import, Terraform proposed creating a namespace that already existed. Import corrected the identity map; configuration alone was not ownership.
- The concurrent plan failed by design. We did not use `-lock=false` or force-unlock because the owner was healthy.

## Architecture decisions

- Use native S3 lockfiles instead of the deprecated DynamoDB locking design for new backends.
- Keep credentials outside backend files and plans.
- Separate backend bootstrap from the root module that consumes it.
- Preserve object versions and treat state as sensitive data.
- Use LocalStack only as a no-cost mechanics simulator; production controls remain explicit gaps.

## Production gaps

- No AWS account, IAM role, TLS path, KMS key, public-access block, audit trail, replication, lifecycle policy, or legal retention policy has been implemented.
- Recovery history exists, but a timed destructive restore drill against a production-equivalent backend remains outstanding.
- Backend bootstrap and break-glass deletion need independent pipeline ownership.
- State partitioning and module/environment contracts remain for Sprint 25.

## Next decision

Sprint 25 converts the single learning root into reusable, versioned modules and explicit environment compositions without creating one giant shared state or hiding provider ownership.
