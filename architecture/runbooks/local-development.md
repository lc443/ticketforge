# TicketForge local container runbook

## Mental model

`tfdeploylocal` should build images and reconcile containers. `tfps` observes container state. `tfapilogs` observes the three API processes. A source change is unavailable to api1/api2/api3 until the shared API image is rebuilt and those containers are recreated.

## Daily commands

```bash
tfdeploylocal
tfps
tfapilogs
```

The Sprint 15 deployment operation is:

```bash
docker compose -f "$TICKETFORGE_ROOT/infrastructure/docker/docker-compose.yml" up -d --build
```

The Dockerfile now builds the backend itself. The recommended alias is therefore:

```bash
alias tfdeploylocal='tfbuild'
```

The older `tfdeploylocal='tfbepackagefast && tfbuild'` still works, but the host Maven package is redundant and slower.

## What `tfdeploylocal` changes

1. Docker compares build instructions and inputs with its layer cache.
2. If backend inputs changed, it builds `ticketforge-api:local` once.
3. Compose recreates api1, api2, and api3 from that same image.
4. Health checks keep the gateway behind the replicas until they are ready.
5. If frontend inputs changed, Angular builds in Node and its static output is copied into Nginx.

## URLs

- Containerized frontend: `http://localhost:4200`
- API gateway: `http://localhost:8080`
- Direct replicas: ports `8081`, `8082`, and `8083`

If the Angular development server already uses 4200:

```bash
FRONTEND_PORT=4300 tfdeploylocal
```

Then open `http://localhost:4300`.

## Data and secrets

PostgreSQL data is stored in the `ticketforge-postgres-data` named volume. Ordinary container recreation preserves it. `docker compose down -v` deletes named volumes and therefore deletes local database data; do not use `-v` unless data loss is intended.

Set `JWT_SECRET` to override the local signing secret:

```bash
JWT_SECRET='a-long-environment-specific-secret' tfdeploylocal
```

Never use the committed local default in a shared or production environment.

## Troubleshooting

```bash
tfps
docker compose -f "$TICKETFORGE_ROOT/infrastructure/docker/docker-compose.yml" logs --tail=200 api-gateway frontend postgres
```

A container being `running` does not prove it is ready. Look for `(healthy)` in `tfps`. If a build behaves unexpectedly, use plain progress output to see which layer invalidated:

```bash
docker compose -f "$TICKETFORGE_ROOT/infrastructure/docker/docker-compose.yml" build --progress=plain api1 frontend
```
