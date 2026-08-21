# Sprint 17 Review: Trusted CI/CD and Artifact Supply Chain

## What this sprint is

Sprint 17 turns local build instructions into an executable delivery policy. It determines which evidence is mandatory, where write authority exists, which bytes become release candidates, and how operators promote or restore those bytes.

## Scenario

A contributor modifies event authorization. Their laptop build passes, but the change may fail on Java 21, break Angular production compilation, introduce a vulnerable dependency, or package a stale operating-system library. Reviewers need automated evidence before merge. After merge, operators need an immutable artifact whose source and workflow identity can be verified and whose previous version can be restored without rebuilding.

## Implemented solution

- Added GitHub Actions triggers for pull requests, sprint branches, `main`, and manual diagnostics.
- Added concurrency cancellation to stop obsolete same-branch runs.
- Added a Java 21 backend gate against PostgreSQL, Redis, and Kafka on an isolated Compose network.
- Added a Node 22 Angular production-build gate.
- Built API, gateway, and frontend images by candidate commit SHA.
- Added Trivy scanning for fixable HIGH and CRITICAL vulnerabilities.
- Remediated runtime and application dependency findings instead of lowering policy.
- Added exact-image archive handoff from the read-only build job to the trusted publication job.
- Added main-only GHCR publication, digest capture, and provenance attestation.
- Added CI and release Compose overrides.
- Added a digest-based promotion and rollback runbook.

## Evidence

GitHub Actions run `32526738146` verified the trusted `main` path: all quality gates passed, all three images were pushed to GHCR, and API, frontend, and gateway provenance attestations succeeded.

| Invariant | Evidence |
|---|---|
| Backend runs on the declared runtime | 11/11 tests passed inside Temurin Java 21 |
| Integration services use production-like DNS | Test container resolved `postgres`, `redis`, and `kafka` on the Compose network |
| CI projects do not collide with local deployment | Fixed names and published ports reset by the CI override |
| Frontend compiles for production | Angular build passed inside Node 22 |
| Every application-owned image is scanned | API, gateway, and frontend included in the artifact job |
| Blocking vulnerabilities are absent | Final scans: 0 HIGH and 0 CRITICAL for all three images |
| The published candidate is the scanned candidate | `docker save`/artifact/`docker load` handoff; no publication rebuild |
| Pull requests have no package credentials | Workflow default is `contents: read`; writes exist only on trusted publication job |
| Replicas run identical application bytes | api1, api2, and api3 reported one image ID |
| Promotion cannot rebuild | Release override resets `build`; runbook requires `--no-build` |
| Rollback target is unambiguous | Previous API, gateway, and frontend digests are recorded and redeployed |

## Failure discoveries

1. Angular interpreted GitHub `${{ ... }}` examples inside the lab as Angular interpolation. Splitting the display-only braces preserved exact syntax without creating template expressions.
2. `-p ticketforge-ci` did not isolate the original Compose file because fixed container and volume names bypassed project scoping. A CI override removed those collisions.
3. The first frontend scan found 35 fixable high-risk packages, including critical OpenSSL findings.
4. The API scan found vulnerable pgJDBC 42.7.11 and a vulnerable Go binary unrelated to TicketForge in the Ubuntu JRE image.
5. The gateway originally used an unscanned third-party runtime directly. It is now a self-contained, patched, scanned TicketForge artifact.

## Tradeoffs and follow-up

- The trusted `main` run proved GHCR permissions, digest outputs, and OIDC attestations.
- Dependency-diff review, SARIF retention, SBOM generation, protected environment approvals, and automated cloud deployment remain future delivery maturity.
- Trivy's Java database is large. The current cache is job-local; persistent GitHub caching can reduce later runtime with additional supply-chain considerations.
- The existing transactional-outbox PostgreSQL LOB defect remains separate operational debt.
- Database migrations need expand-and-contract before automated production rollback is safe.

## Outcome

Sprint 17 provides a verified CI/CD control plane and main-only publication path. Branch gates, exact-image transfer, GHCR publication, and three provenance attestations supplied external evidence.
