# Kubernetes release and recovery runbook

## Purpose

Deploy a TicketForge API release while preserving capacity, then recover when the new image cannot become ready.

## Preconditions

```bash
kubectl config current-context
kubectl get nodes
kubectl get deployment,poddisruptionbudget \
  --namespace ticketforge
kubectl apply --dry-run=server \
  --kustomize infrastructure/kubernetes/overlays/production
```

Confirm the production overlay contains an immutable registry digest or unique release tag. Do not deploy `replace-with-immutable-release`.

## Deploy

```bash
kubectl apply \
  --kustomize infrastructure/kubernetes/overlays/production

kubectl rollout status deployment/ticketforge-api \
  --namespace ticketforge \
  --timeout=240s

kubectl get pods \
  --namespace ticketforge \
  --selector app.kubernetes.io/name=ticketforge-api
```

`maxUnavailable: 0` keeps every previously available production replica until a replacement proves readiness. `maxSurge: 1` limits temporary capacity and scheduling cost.

## Diagnose a stalled rollout

```bash
kubectl describe deployment ticketforge-api \
  --namespace ticketforge

kubectl get events \
  --namespace ticketforge \
  --sort-by=.lastTimestamp

kubectl logs \
  --namespace ticketforge \
  --selector app.kubernetes.io/name=ticketforge-api \
  --all-containers=true \
  --tail=200
```

Classify the failure before recovery: image pull, startup, readiness, capacity, configuration, or dependency failure.

## Preferred recovery

Revert the image reference in Git to the last verified immutable release, merge through the delivery pipeline, and apply the rendered desired state. This keeps Git, the apply annotation, and the cluster aligned.

## Emergency rollback

```bash
kubectl rollout history deployment/ticketforge-api \
  --namespace ticketforge

kubectl rollout undo deployment/ticketforge-api \
  --namespace ticketforge

kubectl rollout status deployment/ticketforge-api \
  --namespace ticketforge \
  --timeout=240s
```

`rollout undo` restores the previous Pod template. It does not reverse database migrations, messages, cache mutations, or other external side effects. Follow it with a Git reconciliation change.

## Persistent-volume warning

Do not change `volumeClaimTemplates` to resize an existing StatefulSet. First inspect expansion support:

```bash
kubectl get storageclass standard \
  --output yaml

kubectl get persistentvolumeclaim \
  --namespace ticketforge
```

If expansion is unsupported, plan a replacement-volume and data-migration procedure. Snapshot and restore evidence belong in a later recovery sprint.

