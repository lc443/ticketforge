#!/usr/bin/env bash
set -euo pipefail

bucket="ticketforge-terraform-state"

awslocal s3api head-bucket --bucket "${bucket}" 2>/dev/null || \
  awslocal s3api create-bucket --bucket "${bucket}"

awslocal s3api put-bucket-versioning \
  --bucket "${bucket}" \
  --versioning-configuration Status=Enabled

awslocal s3api put-bucket-encryption \
  --bucket "${bucket}" \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
