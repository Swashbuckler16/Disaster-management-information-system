output "website_url" {
  description = "Live Production URL of the DMIS System on Vercel"
  value       = "https://${vercel_project.dmis.name}.vercel.app"
}

output "project_id" {
  description = "Vercel Project ID"
  value       = vercel_project.dmis.id
}
