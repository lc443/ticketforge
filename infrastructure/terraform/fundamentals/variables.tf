variable "environment" {
  description = "Deployment environment represented by this catalog."
  type        = string
  default     = "development"

  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging, or production."
  }
}

variable "owner" {
  description = "Team accountable for operating the environment."
  type        = string
  default     = "ticketforge-platform"

  validation {
    condition     = length(trimspace(var.owner)) >= 3
    error_message = "Owner must contain at least three non-whitespace characters."
  }
}

variable "region" {
  description = "Target region identifier used for architecture planning."
  type        = string
  default     = "us-east-1"

  validation {
    condition     = can(regex("^[a-z]{2}-[a-z]+-[0-9]+$", var.region))
    error_message = "Region must use an AWS-style identifier such as us-east-1."
  }
}

variable "api_replicas" {
  description = "Desired API capacity recorded in the environment contract."
  type        = number
  default     = 3

  validation {
    condition     = var.api_replicas >= 2 && var.api_replicas <= 10
    error_message = "API replicas must remain between the availability floor of 2 and capacity ceiling of 10."
  }
}
