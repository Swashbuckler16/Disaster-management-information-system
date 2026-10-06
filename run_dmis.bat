@echo off
title ADREF-DMIS - Agile Disaster Management Information System
color 0b

echo ======================================================================
echo    ADREF-DMIS: Agile Disaster Requirement Evolution Framework
echo    Supporting UN SDG 13 (Climate Action) Digital Preparedness
echo ======================================================================
echo.
echo [1/2] Launching DMIS Application Server on http://localhost:8000 ...
start "" http://localhost:8000
python server.py
pause
