# Terraform state lab

This isolated Sprint 24 environment uses LocalStack `4.14.0` to simulate an S3 state backend with object versioning, AES-256 server-side encryption metadata, and S3 lock files. It is a learning substitute, not production durability or security.

Credentials are supplied through environment variables. Never put backend credentials in `backend.local.hcl`, because Terraform copies backend configuration into `.terraform/` and may include it in plan files.

See `architecture/delivery/terraform-state-runbook.md` for the complete bootstrap, migration, contention, drift, import, recovery, and cleanup exercises.
