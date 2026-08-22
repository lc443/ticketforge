output "catalog_path" {
  description = "Generated file used for the drift exercise."
  value       = local_file.state_lab_catalog.filename
}

output "imported_namespace" {
  description = "Existing namespace adopted into Terraform state."
  value       = kubernetes_namespace.import_lab.metadata[0].name
}

output "state_contract" {
  description = "Non-secret state backend requirements taught by this lab."
  value = {
    backend    = "s3"
    key        = local.state_lab_catalog.state_key
    locking    = local.state_lab_catalog.lock_strategy
    versioning = true
    encryption = "AES256 in the local simulation; KMS required for production"
  }
}
