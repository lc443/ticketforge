# Kubernetes networking runbook

## Install the platform APIs and controller

```bash
kubectl apply --server-side --filename \
  https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.6.1/standard-install.yaml

helm upgrade --install ngf \
  oci://ghcr.io/nginx/charts/nginx-gateway-fabric \
  --version 2.6.7 \
  --create-namespace \
  --namespace nginx-gateway \
  --set nginx.service.type=NodePort \
  --wait \
  --timeout 5m
```

CRDs provide the API schema. The controller converts accepted resources into a functioning data plane. Pin both versions and review upgrades independently.

## Build and deploy locally

```bash
docker build \
  --file infrastructure/docker/Dockerfile.frontend-kubernetes \
  --tag ticketforge-frontend:sprint-20-networking-v2 \
  .

kind load docker-image \
  --name ticketforge \
  ticketforge-frontend:sprint-20-networking-v2

kubectl apply --dry-run=server \
  --kustomize infrastructure/kubernetes/overlays/development

kubectl apply \
  --kustomize infrastructure/kubernetes/overlays/development
```

## Verify reconciliation

```bash
kubectl get gateway,httproute \
  --namespace ticketforge \
  --output wide

kubectl describe httproute ticketforge \
  --namespace ticketforge

kubectl get endpointslices \
  --namespace ticketforge
```

Require `Programmed=True`, `Accepted=True`, and `ResolvedRefs=True`. Then test traffic; status alone is not reachability evidence.

## Verify traffic

```bash
kubectl port-forward \
  --namespace ticketforge \
  service/ticketforge-gateway-nginx \
  18080:80

curl --include http://127.0.0.1:18080/
curl --include http://127.0.0.1:18080/api/events
```

Expected: `/` returns Angular with 200. Unauthenticated `/api/events` returns structured Spring 401 JSON, proving the API route reached the correct backend.

## Diagnose

```bash
kubectl describe gateway ticketforge-gateway --namespace ticketforge
kubectl describe httproute ticketforge --namespace ticketforge
kubectl get events --namespace ticketforge --sort-by=.lastTimestamp
kubectl logs --namespace nginx-gateway deployment/ngf-nginx-gateway-fabric --tail=200
kubectl get service,endpointslice --namespace ticketforge
```

Classify failures by layer: DNS, Service selector/port, route attachment, unresolved backend, controller, data plane, certificate, or NetworkPolicy.

## TLS promotion

Create `ticketforge-tls` through a certificate operator or secret-delivery system; never commit its private key. Replace the example hostname and immutable image placeholders, validate, then apply the production overlay.

## NetworkPolicy proof

```bash
docker exec ticketforge-control-plane \
  cat /etc/cni/net.d/10-kindnet.conflist

kubectl get networkpolicy --namespace ticketforge
```

kindnet does not enforce NetworkPolicy. Run allowed/denied connectivity tests on Cilium, Calico, or another documented enforcing CNI before asserting isolation.

