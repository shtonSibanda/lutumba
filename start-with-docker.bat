@echo off
echo ========================================
echo Starting School Management System
echo ========================================
echo.

echo Checking if Docker is installed...
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not installed!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    echo.
    echo Alternative: Install XAMPP for MySQL
    echo Download from: https://www.apachefriends.org/download.html
    pause
    exit /b 1
)

echo ✅ Docker is installed
echo.

echo Starting MySQL with Docker...
docker-compose up -d mysql

echo.
echo Waiting for MySQL to start...
timeout /t 10 /nobreak >nul

echo.
echo Testing MySQL connection...
node test-mysql.js

echo.
echo Starting the application...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
npm run dev:full 