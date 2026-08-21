# ADR-005: Separate untrusted validation from trusted artifact publication

- Status: Accepted
- Date: 2026-08-21
- Sprint: 17

## Context

TicketForge had reproducible local Docker builds but no automated merge evidence, artifact registry, vulnerability policy, provenance, or rollback contract. Pull-request code is untrusted and must not receive registry credentials. GitHub jobs also do not share a Docker daemon, so rebuilding in a later publication job would break the claim that the published image is the artifact that passed scanning.

TicketForge deploys three application-owned images: API, API gateway, and frontend. Omitting the gateway from scanning would leave an internet-facing artifact outside the security boundary.

## Decision

1. Run backend tests, frontend production compilation, and deployment-image builds as independent GitHub Actions jobs.
2. Exercise backend context tests against isolated PostgreSQL, Redis, and Kafka services through Compose DNS on Java 21.
3. Give the workflow `contents: read` by default. Grant package, OIDC, and attestation writes only to a trusted `main` publication job.
4. Scan the final API, gateway, and frontend images with Trivy. Block fixable `HIGH` and `CRITICAL` findings.
5. Export the exact scanned images with `docker save`, retain the handoff artifact for one day, and load it in the publication job. Do not rebuild between scanning and publication.
6. Publish commit-SHA tags to GHCR, capture immutable registry digests, and attach GitHub/Sigstore provenance attestations.
7. Promote API, gateway, and frontend digest references through a release Compose override that removes local build definitions.
8. Require `--no-build` and health-gated rollout. Roll back by restoring previous known-good digests.
9. Pin third-party GitHub Actions to full commit SHAs.

## Alternatives

### Publish directly from pull requests

Rejected because untrusted code would gain package-write authority and could create registry artifacts before review.

### Rebuild in the publication job

Rejected because mutable package repositories, base-image tags, and build timestamps can produce bytes different from the scanned image.

### Use only mutable `latest` tags

Rejected because operators could not prove which bytes were deployed or select an unambiguous rollback target.

### Scan only application dependencies

Rejected because the first real scan found material risk in NGINX, Alpine, the JRE image, and pgJDBC. Source-manifest review alone does not cover the runtime filesystem.

## Consequences

- Pull requests receive correctness and security evidence without registry credentials.
- Every application-owned deployment artifact is inside the build and scan boundary.
- Artifact archives consume temporary GitHub storage and add handoff time; one-day retention and zero recompression bound that cost.
- Trivy downloads large OS and Java advisory databases. A job-local named volume lets sequential scans reuse them.
- `apk upgrade` makes runtime rebuilds consume current patched packages, so registry digests—not Dockerfile text alone—become the immutable release identity.
- Image rollback remains constrained by database compatibility. Schema evolution must use expand-and-contract during the rollback window.
- GHCR publication and signed provenance can only be proven by a trusted GitHub `main` run.

## Verification

- Backend Java 21 integration suite: 11 tests, 0 failures, 0 errors.
- Angular Node 22 production build passed.
- Initial scans exposed 35 frontend findings, pgJDBC CVE-2026-54291, and a vulnerable Pebble binary in the Ubuntu JRE runtime.
- Remediation upgraded pgJDBC to 42.7.12, moved the API runtime to Temurin Alpine, upgraded NGINX/Alpine packages, and made the gateway self-contained.
- Final API, gateway, and frontend scans each reported 0 fixable HIGH and 0 CRITICAL findings.
- The CI Compose override produced isolated project-scoped dependencies without fixed names or host ports.
- The release Compose model resolved all three API replicas to one digest and contained no application build definitions.
- Full local deployment reached healthy state; all three API replicas used image ID `sha256:d99be2d6...be39c81`.
