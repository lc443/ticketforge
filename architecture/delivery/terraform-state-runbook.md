# Terraform state operations runbook

## Purpose

This runbook teaches the operational lifecycle of shared Terraform state using a disposable, loopback-only S3-compatible backend. Run commands from the TicketForge repository root.

## Scenario

Two engineers manage the same environment. One applies a network change while the other prepares a database change. Meanwhile, an emergency operator edits a resource manually. The team needs one identity registry, serialized writes, drift evidence, and a recovery trail.

## 1. Confirm prerequisites

```bash
docker version
docker compose version
kubectl config current-context
kubectl get nodes
./.tools/terraform version
aws --version
```

The Kubernetes provider expects context `kind-ticketforge`. Stop if that context points to a shared or production cluster.

## 2. Bootstrap the backend

```bash
docker compose \
  --file infrastructure/terraform/state-lab/backend/docker-compose.yml \
  config

docker compose \
  --file infrastructure/terraform/state-lab/backend/docker-compose.yml \
  up --detach --wait

docker compose \
  --file infrastructure/terraform/state-lab/backend/docker-compose.yml \
  ps
```

`--file` selects this lab's Compose model. `up` creates or reconciles it, `--detach` leaves it running, and `--wait` requires health before success. The service publishes `127.0.0.1:4566`, so it is not exposed on every host interface.

The ready hook creates the bucket and configures versioning plus AES-256 server-side encryption metadata. Verify both:

```bash
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1

aws --endpoint-url http://localhost:4566 \
  s3api get-bucket-versioning \
  --bucket ticketforge-terraform-state

aws --endpoint-url http://localhost:4566 \
  s3api get-bucket-encryption \
  --bucket ticketforge-terraform-state
```

Expected evidence is `Status: Enabled` and `SSEAlgorithm: AES256`. These test credentials and HTTP endpoint are local simulation values; production requires workload identity, TLS, IAM, and KMS.

## 3. Initialize the partial backend

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  init -backend-config=backend.local.hcl

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  fmt -check -recursive

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  validate
```

`backend.tf` declares the backend type. `backend.local.hcl` supplies endpoint compatibility settings. Credentials remain in environment variables because backend configuration is copied into local metadata and can be captured in plan files.

## 4. Prove that configuration is not ownership

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  state list

kubectl create namespace ticketforge-import-lab

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  plan -out=before-import.tfplan
```

The plan proposes three additions. The namespace exists in Kubernetes, but Terraform does not own it because state has no address-to-ID mapping.

## 5. Adopt the existing namespace

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  import kubernetes_namespace.import_lab ticketforge-import-lab

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  state show kubernetes_namespace.import_lab

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  plan -out=after-import.tfplan

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  apply after-import.tfplan
```

`import ADDRESS ID` records the ownership binding. The post-import plan adds the other resources and reconciles labels on the existing namespace; it does not recreate it.

## 6. Detect and repair drift

Change `state_backend` to `manual-edit` in the generated JSON file. This simulates an out-of-band console edit.

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  plan -refresh-only

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  plan -out=repair-drift.tfplan

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  apply repair-drift.tfplan

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  plan
```

A refresh-only plan asks, “Should state accept reality?” A normal plan asks, “How should reality return to declared intent?” TicketForge applies the normal repair. The final result must say `No changes`.

## 7. Rehearse lock contention

In terminal A:

```bash
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  apply -auto-approve \
  -var=lock_drill_nonce=contention \
  -var=lock_hold_seconds=20
```

While terminal A sleeps, run in terminal B:

```bash
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  plan -lock-timeout=3s
```

Expected failure: `Error acquiring the state lock`. The output includes lock ID, path, operation, owner, and creation time. Do not add `-lock=false`, and do not force-unlock a live owner. After terminal A completes, repeat a plan using the same variables and expect `No changes`.

## 8. Inspect history and prepare recovery

```bash
aws --endpoint-url http://localhost:4566 \
  s3api list-object-versions \
  --bucket ticketforge-terraform-state \
  --prefix ticketforge/state-lab/terraform.tfstate

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  state pull
```

Treat pulled state as sensitive. For a real recovery: stop writers, record the incident, choose and preserve both current and candidate versions, restore the approved object version, run refresh and plan, have a second operator review the blast radius, then apply only the approved reconciliation. Record recovery time and data loss against RTO/RPO.

## 9. Negative validation

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  plan -var=lock_hold_seconds=61
```

Expected failure: the value exceeds the training-only 60-second safety bound. This proves the drill cannot accidentally hold the lock indefinitely.

## 10. Ordered teardown

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  plan -destroy \
  -var=lock_drill_nonce=contention \
  -var=lock_hold_seconds=20

./.tools/terraform \
  -chdir=infrastructure/terraform/state-lab/root \
  destroy \
  -var=lock_drill_nonce=contention \
  -var=lock_hold_seconds=20

kubectl get namespace ticketforge-import-lab

docker compose \
  --file infrastructure/terraform/state-lab/backend/docker-compose.yml \
  down --volumes
```

Destroy managed resources while their registry still exists. Then remove the disposable backend. `down --volumes` permanently deletes the local state history; production state backends require independent retention and break-glass deletion controls.

## Troubleshooting

- `connection refused` on port 4566: run Compose `ps` and inspect the LocalStack health check.
- `No state file was found`: verify initialization used `backend.local.hcl`, the bucket exists, and credentials are exported.
- lock error: read the owner and operation, coordinate, and retry. Use `force-unlock LOCK_ID` only after proving the owner no longer exists.
- Kubernetes connection error: verify the `kind-ticketforge` context and cluster are active.
- provider download failure: check network access and the committed `.terraform.lock.hcl`; do not delete the lock file as a first response.
