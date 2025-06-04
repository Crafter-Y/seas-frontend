@echo off
REM Reading .env File
for /f "tokens=1,2 delims==" %%A in (.env) do set %%A=%%B

REM Check if an argument was passed
if "%~1"=="" (
    echo Please provide a flow file. Example: .\maestro.bat .\.maestro\login.yml
    exit /b 1
)

REM Call Maestro with the specified flow
maestro test "%1"