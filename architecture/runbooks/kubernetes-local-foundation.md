# Local Kubernetes foundation runbook

## Purpose

Create, deploy, inspect, exercise, and remove the Sprint 18 kind environment. Commands run from the repository root and use actual tool syntax.

## Safety check

```bash
kubectl config current-context
kubectl get nodes --output wide
```

The expected context is `kind-ticketforge`. Stop if another context is active.

## Create the cluster

```bash
kind create cluster --name ticketforge
```

## Create local credentials

Generate a 64-character development signing value without committing it:

```bash
openssl rand -hex 32
```

Create the Secret with local values:

```bash
kubectl create secret generic ticketforge-api-secret \
  --namespace ticketforge \
  --from-literal=DB_USERNAME=postgres \
  --from-literal=DB_PASSWORD='<local-password>' \
  --from-literal=JWT_SECRET='<64-character-value>'
```

Do not paste real values into documentation, Git history, tickets, or chat.

## Build and load the API image

```bash
docker build \
  --file infrastructure/docker/Dockerfile.api \
  --tag ticketforge-api:k8s \
  .

kind load docker-image \
  --name ticketforge \
  ticketforge-api:k8s
```

## Validate and deploy

```bash
kubectl apply --dry-run=server \
  --kustomize infrastructure/kubernetes/base

kubectl apply \
  --kustomize infrastructure/kubernetes/base

kubectl rollout status deployment/ticketforge-api \
  --namespace ticketforge \
  --timeout=240s
```

## Inspect evidence

```bash
kubectl get deployments,pods,services \
  --namespace ticketforge \
  --output wide

kubectl get endpointslices \
  --namespace ticketforge \
  --selector kubernetes.io/service-name=ticketforge-api

kubectl get events \
  --namespace ticketforge \
  --sort-by=.lastTimestamp
```

## Test through the Service

Terminal one:

```bash
kubectl port-forward \
  --namespace ticketforge \
  service/ticketforge-api 18080:8080
```

Terminal two:

```bash
curl --include http://127.0.0.1:18080/actuator/health
```

Stop the port-forward with `Ctrl+C`.

## Failure drill

Resolve an exact disposable Pod name first:

```bash
kubectl get pods \
  --namespace ticketforge \
  --selector app.kubernetes.io/name=ticketforge-api
```

Delete one explicit API Pod and watch the replacement:

```bash
kubectl delete pod <exact-api-pod-name> \
  --namespace ticketforge

kubectl get pods \
  --namespace ticketforge \
  --selector app.kubernetes.io/name=ticketforge-api \
  --watch
```

## Diagnostics

```bash
kubectl describe pod <pod-name> --namespace ticketforge
kubectl logs <pod-name> --namespace ticketforge --container api --previous
kubectl get events --namespace ticketforge --sort-by=.lastTimestamp
```

Use `describe` for scheduling, image, Secret, and probe events. Use `logs --previous` when a container restarted and the current logs no longer contain the failure.

## Remove the lab cluster

```bash
kind delete cluster --name ticketforge
```

This deletes the Kubernetes node and all ephemeral Sprint 18 data. The checked-in manifests remain.
