locals {
  chart = yamldecode(data.local_file.helm_chart.content)

  common_labels = {
    application = "ticketforge"
    environment = var.environment
    managed_by  = "terraform"
    owner       = var.owner
  }

  service_endpoints = {
    frontend = "https://${var.environment}.ticketforge.local"
    api      = "https://${var.environment}.ticketforge.local/api"
  }

  environment_catalog = {
    name      = "ticketforge-${var.environment}"
    region    = var.region
    labels    = local.common_labels
    endpoints = local.service_endpoints
    application = {
      chart_name    = local.chart.name
      chart_version = local.chart.version
      app_version   = local.chart.appVersion
      api_replicas  = var.api_replicas
    }
  }
}
