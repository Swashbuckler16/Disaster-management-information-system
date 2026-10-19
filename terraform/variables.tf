variable "vercel_api_token" {
  description = "Vercel API Token (generated for free at vercel.com/account/tokens)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "project_name" {
  description = "Vercel Project Name"
  type        = string
  default     = "dmis-disaster-system"
}
