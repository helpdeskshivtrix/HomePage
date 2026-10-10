@echo off
title ShivTrix Core - Companion & Web Server
echo ===================================================================
echo   ShivTrix Core - Companion & Web Server (http://127.0.0.1:9871)
echo ===================================================================
set PY=python
where python >nul 2>nul || set PY=py -3
echo Installing/Checking psutil for real hardware telemetry...
%PY% -m pip install --quiet psutil
%PY% "%~dp0companion.py"
pause
