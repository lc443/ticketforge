# Kubernetes autoscaling runbook

## Install local metrics support

```bash
kubectl apply --filename \
  https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.8.1/components.yaml

kubectl patch deployment metrics-server \
  --namespace kube-system \
  --type=json \
  --patch='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'

kubectl wait apiservice/v1beta1.metrics.k8s.io \
  --for=condition=Available \
  --timeout=180s
```

The TLS exception is only for kind's self-signed kubelet serving certificate. Production should establish certificate trust.

## Validate and deploy

```bash
kubectl apply --dry-run=server \
  --kustomize infrastructure/kubernetes/overlays/development

kubectl apply \
  --kustomize infrastructure/kubernetes/overlays/development

kubectl get horizontalpodautoscaler ticketforge-api \
  --namespace ticketforge
```

## Run the scale drill

```bash
kubectl apply --filename \
  infrastructure/kubernetes/exercises/hpa-load.yaml

kubectl get horizontalpodautoscaler ticketforge-api \
  --namespace ticketforge \
  --watch

kubectl top pods \
  --namespace ticketforge \
  --selector app.kubernetes.io/name=ticketforge-api
```

The exercise includes a narrow NetworkPolicy because default-deny blocks direct generator-to-API traffic.

## Stop and verify scale-in

```bash
kubectl delete --filename \
  infrastructure/kubernetes/exercises/hpa-load.yaml

kubectl describe horizontalpodautoscaler ticketforge-api \
  --namespace ticketforge

kubectl get deployment ticketforge-api \
  --namespace ticketforge \
  --watch
```

## Diagnose an unsafe scale-out

```bash
kubectl top nodes
kubectl get events --all-namespaces --sort-by=.lastTimestamp
kubectl describe horizontalpodautoscaler ticketforge-api --namespace ticketforge
kubectl get pods --all-namespaces
```

If the control plane is starved, stop controller contention before manual scaling:

```bash
kubectl delete horizontalpodautoscaler ticketforge-api \
  --namespace ticketforge

kubectl scale deployment ticketforge-api \
  --namespace ticketforge \
  --replicas=3
```

Reapply the declared HPA only after correcting requests, limits, targets, or cluster capacity. Deleting the live HPA does not delete its source manifest.

## Capacity questions before production

- Can nodes schedule `maxReplicas × requests` plus platform and dependency reserve?
- Does each replica add consumers, threads, database pools, or cache connections?
- Does the chosen metric represent customer demand or background work?
- What is the maximum affordable replica count?
- How quickly can node autoscaling supply capacity relative to Pod startup?

