variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 Instance Type (free-tier eligible)"
  type        = string
  default     = "t3.micro"
}

variable "project_name" {
  description = "Project Name identifier"
  type        = string
  default     = "dmis-disaster-system"
}

variable "aws_access_key" {
  description = "AWS Access Key ID"
  type        = string
  sensitive   = true
  default     = ""
}

variable "aws_secret_key" {
  description = "AWS Secret Access Key"
  type        = string
  sensitive   = true
  default     = ""
}
