variable "kubeconfig_path" {
  description = "Path to the kubeconfig used only for the disposable import exercise."
  type        = string
  default     = "~/.kube/config"
}

variable "kube_context" {
  description = "Kubernetes context containing the disposable import namespace."
  type        = string
  default     = "kind-ticketforge"
}

variable "lock_drill_nonce" {
  description = "Change this value to replace the lock-drill resource and hold the remote lock."
  type        = string
  default     = "baseline"
}

variable "lock_hold_seconds" {
  description = "Number of seconds the explicit lock drill holds the Terraform operation."
  type        = number
  default     = 0

  validation {
    condition     = var.lock_hold_seconds >= 0 && var.lock_hold_seconds <= 60
    error_message = "Lock hold must remain between 0 and 60 seconds."
  }
}
