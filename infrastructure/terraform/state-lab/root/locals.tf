locals {
  chart = yamldecode(data.local_file.helm_chart.content)

  state_lab_catalog = {
    purpose       = "terraform-state-learning"
    chart_name    = local.chart.name
    chart_version = local.chart.version
    state_backend = "s3"
    state_key     = "ticketforge/state-lab/terraform.tfstate"
    lock_strategy = "s3-lockfile"
  }
}
