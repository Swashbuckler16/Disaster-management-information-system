@echo off
REM Terraform Docker wrapper script
set "SCRIPT_DIR=%~dp0"
docker run --rm -i ^
  -v "%SCRIPT_DIR%terraform:/workspace" ^
  -w /workspace ^
  hashicorp/terraform:latest %*
