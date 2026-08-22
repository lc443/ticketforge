output "catalog_path" {
  description = "Absolute path to the generated environment catalog."
  value       = local_file.environment_catalog.filename
}

output "release_contract" {
  description = "Normalized release inputs available to downstream automation."
  value       = terraform_data.release_contract.output
}

output "service_endpoints" {
  description = "Same-origin frontend and API endpoints for the environment."
  value       = local.service_endpoints
}
