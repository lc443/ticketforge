# Sprint 17 CI/CD requirements

## Scenario

A contributor changes TicketForge event authorization. The change builds on their laptop, but it may fail on Java 21, break the Angular production bundle, alter a Docker build context, or introduce an unsafe dependency. Reviewers need automated evidence before the change can enter `main`; operators later need to know exactly which reviewed commit produced a running image.

## Pipeline objectives

1. Reject changes that fail backend tests, frontend production compilation, or either container build.
2. Run builds with TicketForge's declared runtimes: Java 21 and Node 22.
3. Exercise the backend against PostgreSQL, Redis, and Kafka rather than silently skipping its application-context test.
4. Give pull-request code read-only repository permissions and no registry credentials.
5. Publish images only from trusted `main` or an explicitly approved release event.
6. Identify release artifacts by commit SHA and OCI digest.
7. Generate verifiable provenance linking an artifact to repository, workflow, and commit.
8. Promote an existing digest between environments; never rebuild the same source separately per environment.
9. Roll back by redeploying a previously verified digest.
10. Keep diagnostic logs bounded and avoid printing secrets.

## Non-functional requirements

| Quality | Requirement |
|---|---|
| Feedback | Pull-request gates should target completion within 15 minutes on a GitHub-hosted runner. |
| Security | Default token permissions are `contents: read`; publishing permissions exist only in the release job. |
| Reproducibility | Dependency lockfiles and multi-stage Dockerfiles are authoritative. |
| Traceability | Every published image carries the source revision and is addressable by immutable digest. |
| Reliability | A failed gate blocks publication; diagnostic dependency logs run only after failure. |
| Cost | Cancel superseded runs on the same branch to avoid paying for obsolete feedback. |

## Trust boundaries

```text
Untrusted PR source
        │ read-only token
        ▼
Test and build gates ── no registry login
        │ reviewed merge
        ▼
Trusted main workflow ── scoped package/OIDC permissions
        │
        ▼
GHCR image + provenance ── immutable digest
        │ explicit approval
        ▼
Environment deployment
```

## Gate policy

- `backend`: start PostgreSQL, Redis, and Kafka; attach the Java 21 test container to the same Compose network so service DNS and Kafka advertised listeners match production topology; execute the complete Maven test suite.
- `frontend`: use `npm ci` and create the Angular production bundle inside Node 22.
- `container-builds`: prove the API, API gateway, and frontend deployment Dockerfiles build from a clean checkout.
- Container vulnerability scanning blocks fixable `HIGH` and `CRITICAL` findings in all three deployment images. Unfixed findings remain review evidence but do not block this learning environment.
- A trusted `main` push exports the exact scanned images, hands them to a separately permissioned publication job, pushes commit-SHA tags to GHCR, and attests each registry digest.
- Promotion supplies the three verified digests through the release Compose override; `--no-build` prevents environment-specific rebuilds.
- Dependency review is a separate source-change gate and remains a follow-up after the container scanning baseline.

## Alternatives

### Build directly on the runner

Faster with setup-action caching, but runner runtime changes can diverge from Docker production runtimes. TicketForge initially selects Dockerized tools for consistency.

### Publish images from pull requests

Provides early artifacts but grants write authority to untrusted code and creates registry noise. Rejected.

### Tag only with `latest`

Convenient for humans but mutable and ambiguous during rollback. A convenience tag may exist later, but deployments must use a SHA tag or digest.
