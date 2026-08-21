# TicketForge image promotion and rollback runbook

## Purpose

Promote the exact API, gateway, and frontend images that passed CI. A promotion changes environment configuration to immutable GHCR digests; it never rebuilds source code.

## Required evidence

- The source commit was reviewed and merged to `main`.
- The `Pull request quality gates` workflow passed backend, frontend, container build, and vulnerability gates.
- GHCR contains all three `sha-<commit>` tags.
- GitHub verifies provenance for all three image digests.
- The target environment approval has been recorded.
- The current known-good digests have been copied into the change record before rollout.

## Variables

Use the full registry references returned by CI. The value after `@` is the immutable manifest digest.

```bash
export API_IMAGE='ghcr.io/lc443/ticketforge-api@sha256:<verified-api-digest>'
export GATEWAY_IMAGE='ghcr.io/lc443/ticketforge-gateway@sha256:<verified-gateway-digest>'
export FRONTEND_IMAGE='ghcr.io/lc443/ticketforge-frontend@sha256:<verified-frontend-digest>'
```

`export` makes a shell variable available to child processes such as `docker compose`. Quotes prevent shell metacharacters from being interpreted. A digest is content-addressed: changing any image byte creates a different value.

## Verify provenance before promotion

```bash
gh attestation verify "$API_IMAGE" --repo lc443/ticketforge
gh attestation verify "$GATEWAY_IMAGE" --repo lc443/ticketforge
gh attestation verify "$FRONTEND_IMAGE" --repo lc443/ticketforge
```

`gh attestation verify` checks the signed statement and certificate. `--repo` constrains the trusted source repository; without that identity check, a valid signature from another project would not prove TicketForge built the image.

## Inspect the resolved release model

```bash
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.release.yml \
  config
```

Compose merges files from left to right. The release file replaces local tags with digest references and `!reset null` removes build definitions. Stop if `config` shows a `build:` key for `api1`, `api-gateway`, or `frontend`.

## Pull without changing running containers

```bash
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.release.yml \
  pull api1 api2 api3 api-gateway frontend
```

`pull` stages the selected artifacts before rollout. It does not restart the current service. Pulling first separates registry/download failure from application replacement.

## Promote the verified release

```bash
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.release.yml \
  up -d --no-build --wait api1 api2 api3 api-gateway frontend
```

- `up` reconciles containers with the merged desired state.
- `-d` runs them in the background.
- `--no-build` makes an accidental source rebuild a hard failure.
- `--wait` blocks until health checks pass or Compose reports failure.
- Listing services limits the change to the stateless delivery tier; PostgreSQL, Redis, and Kafka are not recreated.

## Post-deployment verification

```bash
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.release.yml \
  ps

curl --fail --silent http://localhost:8080/actuator/health
curl --fail --silent http://localhost:4200/health
```

Confirm that all three APIs, the gateway, and frontend are healthy. Then exercise one authenticated event read and one reservation failure path. Health probes prove process readiness; a business transaction proves routing, authentication, and persistence still work together.

## Rollback trigger

Rollback when the new release fails health checks, materially increases error rate or latency, or breaks a critical business transaction. Do not rebuild the old commit.

## Rollback procedure

Set the variables to the previous known-good digests recorded before rollout:

```bash
export API_IMAGE='ghcr.io/lc443/ticketforge-api@sha256:<previous-api-digest>'
export GATEWAY_IMAGE='ghcr.io/lc443/ticketforge-gateway@sha256:<previous-gateway-digest>'
export FRONTEND_IMAGE='ghcr.io/lc443/ticketforge-frontend@sha256:<previous-frontend-digest>'

docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.release.yml \
  up -d --no-build --wait api1 api2 api3 api-gateway frontend
```

Repeat the health and business checks. Preserve logs from the failed release for investigation.

## Database compatibility constraint

Image rollback is safe only when database changes are backward compatible. Future migrations must use expand-and-contract: add compatible structures first, deploy code, migrate data, and remove old structures only after the rollback window closes.
