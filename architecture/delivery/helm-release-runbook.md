# Helm release runbook

## Ownership boundary

This chart owns the TicketForge stateless application plane. Install the data plane, Gateway controller, Metrics Server, Secret, and TLS issuer separately. Do not install the chart over the Kustomize-managed `ticketforge` resources: use a new namespace or execute an explicit ownership migration.

## Validate the chart

```bash
helm lint infrastructure/helm/ticketforge

helm template ticketforge-dev infrastructure/helm/ticketforge \
  > /tmp/ticketforge-development.yaml

helm template ticketforge-prod infrastructure/helm/ticketforge \
  --values infrastructure/helm/ticketforge/values-production.yaml \
  > /tmp/ticketforge-production.yaml

kubectl apply --dry-run=server \
  --filename /tmp/ticketforge-development.yaml

kubectl apply --dry-run=server \
  --filename /tmp/ticketforge-production.yaml
```

Prove the schema's failure path:

```bash
helm template invalid infrastructure/helm/ticketforge \
  --set api.autoscaling.maxReplicas=0
```

The command must fail with `minimum: got 0, want 1`.

## Package and inspect

```bash
helm package infrastructure/helm/ticketforge --destination /tmp
helm show chart /tmp/ticketforge-0.1.0.tgz
```

The `.tgz` is the immutable chart artifact. Publish and promote that artifact instead of rebuilding it per environment.

## Install or upgrade

```bash
helm upgrade --install ticketforge \
  /tmp/ticketforge-0.1.0.tgz \
  --namespace ticketforge-release \
  --create-namespace \
  --values infrastructure/helm/ticketforge/values-production.yaml \
  --wait \
  --atomic \
  --timeout=5m
```

- `upgrade --install` is idempotent for automation.
- `--wait` ties success to workload readiness.
- `--atomic` removes a failed install or rolls back a failed upgrade.
- `--timeout` bounds how long the pipeline can wait.

Use immutable image digests in production values. Do not deploy the placeholder registry paths.

## Test and inspect

```bash
helm test ticketforge \
  --namespace ticketforge-release \
  --logs \
  --timeout=2m

helm status ticketforge --namespace ticketforge-release
helm get values ticketforge --namespace ticketforge-release --all
helm get manifest ticketforge --namespace ticketforge-release
helm history ticketforge --namespace ticketforge-release
```

The test Pod is permitted only to the frontend Service port. A successful hook under default-deny proves both service health and the intended policy exception.

## Roll back

```bash
helm history ticketforge --namespace ticketforge-release

helm rollback ticketforge 1 \
  --namespace ticketforge-release \
  --wait \
  --timeout=5m

helm test ticketforge \
  --namespace ticketforge-release \
  --logs
```

Rollback creates a new revision from an old release state. It does not undo database migrations, published Kafka messages, or calls to external systems. Those require compatible migrations and application-level recovery plans.

## Uninstall a disposable release

```bash
helm uninstall ticketforge-chart-test \
  --namespace ticketforge-helm-test

kubectl delete namespace ticketforge-helm-test
```

Only use this cleanup for an identified disposable namespace. Uninstall removes Helm-owned resources; namespace deletion removes any remaining namespaced test state.
