terraform {
  required_version = ">= 1.5.0"
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
}

# Vercel Project linked to GitHub repository
resource "vercel_project" "dmis" {
  name      = var.project_name
  framework = null

  git_repository = {
    type = "github"
    repo = "Swashbuckler16/Disaster-management-information-system"
  }
}

# Production Domain Configuration (*.vercel.app with automatic SSL)
resource "vercel_project_domain" "dmis_domain" {
  project_id = vercel_project.dmis.id
  domain     = "${var.project_name}.vercel.app"
}
