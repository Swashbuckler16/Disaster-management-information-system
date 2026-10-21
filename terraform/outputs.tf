output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.dmis_ec2.id
}

output "instance_public_ip" {
  description = "Public IP address of the DMIS EC2 instance"
  value       = aws_instance.dmis_ec2.public_ip
}

output "website_url" {
  description = "Live Production URL of DMIS on EC2 (port 8000)"
  value       = "http://${aws_instance.dmis_ec2.public_ip}:8000"
}

output "website_url_http" {
  description = "Live Production URL of DMIS on EC2 (port 80)"
  value       = "http://${aws_instance.dmis_ec2.public_ip}"
}
