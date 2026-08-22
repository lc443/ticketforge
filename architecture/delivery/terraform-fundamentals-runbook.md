# Terraform fundamentals runbook

## Tool installation

Preferred system installation on a supported macOS toolchain:

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform version
```

On this macOS 27 prerelease, Homebrew refused installation because the Xcode Command Line Tools were outdated. Sprint 23 therefore uses a checksum-verified ARM64 binary at `.tools/terraform`. Do not delete system developer tools merely to satisfy this lab.

Project-local fallback:

```bash
mkdir -p .tools /tmp/ticketforge-terraform-download

curl --fail --location \
  --output /tmp/ticketforge-terraform-download/terraform_1.15.8_darwin_arm64.zip \
  https://releases.hashicorp.com/terraform/1.15.8/terraform_1.15.8_darwin_arm64.zip

curl --fail --location \
  --output /tmp/ticketforge-terraform-download/terraform_1.15.8_SHA256SUMS \
  https://releases.hashicorp.com/terraform/1.15.8/terraform_1.15.8_SHA256SUMS

shasum -a 256 \
  /tmp/ticketforge-terraform-download/terraform_1.15.8_darwin_arm64.zip

rg terraform_1.15.8_darwin_arm64.zip \
  /tmp/ticketforge-terraform-download/terraform_1.15.8_SHA256SUMS

unzip -o \
  /tmp/ticketforge-terraform-download/terraform_1.15.8_darwin_arm64.zip \
  terraform -d .tools

./.tools/terraform version
```

The computed and published hashes must match before extraction. `.tools/` is ignored because binaries are platform-specific build dependencies, not source.

## Initialize dependencies

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  init
```

`init` prepares the current backend and provider plugins. Commit `.terraform.lock.hcl`; do not commit `.terraform/`.

## Check quality

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  fmt -check -recursive

./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  validate
```

Formatting is a source-quality check. Validation checks Terraform/provider schemas and references, but it does not prove a proposed change is safe.

## Plan and apply

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  plan -out=tfplan

./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  apply tfplan

./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  output
```

Review the resource addresses and create/update/replace/destroy symbols before applying. A saved plan ensures apply executes the reviewed proposal.

## Prove idempotence and change behavior

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  plan

./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  plan -var=api_replicas=4 -out=tfplan

./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  apply tfplan
```

The unchanged plan must say `No changes`. The capacity plan shows `terraform_data` updating in place and `local_file` replacing because content contributes to its identity.

## Prove the failure path

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  plan -var=api_replicas=1
```

The plan must fail because one replica violates the declared availability floor.

## Destroy the isolated resources

Use the same input values that produced the current state:

```bash
./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  plan -destroy -var=api_replicas=4

./.tools/terraform \
  -chdir=infrastructure/terraform/fundamentals \
  destroy -var=api_replicas=4
```

Confirm the plan contains only the two expected addresses. This sprint's catalog is disposable; do not generalize automatic approval to shared or production infrastructure.
