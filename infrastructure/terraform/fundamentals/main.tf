data "local_file" "helm_chart" {
  filename = "${path.module}/../../helm/ticketforge/Chart.yaml"
}

resource "terraform_data" "release_contract" {
  input = {
    environment   = var.environment
    region        = var.region
    chart_version = local.chart.version
    api_replicas  = var.api_replicas
  }

  lifecycle {
    precondition {
      condition     = local.chart.type == "application"
      error_message = "TicketForge must be packaged as a Helm application chart."
    }
  }
}

resource "local_file" "environment_catalog" {
  filename        = "${path.module}/generated/${var.environment}/environment.json"
  content         = jsonencode(local.environment_catalog)
  file_permission = "0644"

  depends_on = [terraform_data.release_contract]
}
