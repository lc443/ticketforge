data "local_file" "helm_chart" {
  filename = "${path.module}/../../../helm/ticketforge/Chart.yaml"
}

resource "local_file" "state_lab_catalog" {
  filename        = "${path.module}/generated/state-lab.json"
  content         = jsonencode(local.state_lab_catalog)
  file_permission = "0644"
}

resource "terraform_data" "lock_drill" {
  triggers_replace = var.lock_drill_nonce

  provisioner "local-exec" {
    command = "sleep ${var.lock_hold_seconds}"
  }
}

resource "kubernetes_namespace" "import_lab" {
  metadata {
    name = "ticketforge-import-lab"
    labels = {
      "app.kubernetes.io/part-of"    = "ticketforge"
      "app.kubernetes.io/component"  = "terraform-state-lab"
      "app.kubernetes.io/managed-by" = "Terraform"
    }
  }
}
