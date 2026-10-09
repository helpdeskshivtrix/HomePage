@echo off
title ShivTrix Core - Rainmeter Accuracy Companion & Web Server
echo ===================================================================
echo   ShivTrix Core - Rainmeter Accuracy Companion & Web Server
echo   Starting Local Task Manager Bridge & Web Server on port 9871...
echo ===================================================================
python "%~dp0companion.py"
if errorlevel 1 (
    echo Python not found in PATH. Trying py launcher...
    py -3 "%~dp0companion.py"
)
pause
