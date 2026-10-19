@echo off
REM Terraform Docker wrapper script for Vercel
set "SCRIPT_DIR=%~dp0"
docker run --rm ^
  -v "%SCRIPT_DIR%terraform:/workspace" ^
  -w /workspace ^
  -e VERCEL_API_TOKEN=%VERCEL_API_TOKEN% ^
  hashicorp/terraform:latest %*
