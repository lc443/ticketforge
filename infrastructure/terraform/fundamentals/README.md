# Terraform fundamentals environment catalog

This root module is Sprint 23's safe Terraform lifecycle exercise. It reads TicketForge's Helm chart contract and manages a generated environment catalog without cloud credentials or billable resources.

```bash
cd infrastructure/terraform/fundamentals

../../../.tools/terraform init
../../../.tools/terraform fmt --check --recursive
../../../.tools/terraform validate
../../../.tools/terraform plan --out=tfplan
../../../.tools/terraform apply tfplan
../../../.tools/terraform output
../../../.tools/terraform plan
../../../.tools/terraform destroy
```

Copy `terraform.tfvars.example` to an ignored or otherwise local `terraform.tfvars` only when you need different inputs. Never commit credentials in variable files; Terraform variables are configuration transport, not a secret manager.

The generated catalog and local state are ignored. Sprint 24 will explain why local state cannot safely coordinate a team and will introduce state, locking, drift, and import explicitly.
