@echo off
echo ========================================
echo MySQL Connection Diagnostic & Fix
echo ========================================

echo.
echo Step 1: Checking if MySQL is installed...
where mysql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL command found
) else (
    echo ❌ MySQL not found in PATH
    echo.
    echo Please install MySQL from: https://dev.mysql.com/downloads/mysql/
    echo Or add MySQL to your PATH environment variable
    pause
    exit /b 1
)

echo.
echo Step 2: Checking MySQL service status...
sc query mysql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL service exists
    sc query mysql | find "RUNNING" >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MySQL service is running
    ) else (
        echo ⚠️  MySQL service is not running, attempting to start...
        net start mysql
        if %ERRORLEVEL% EQU 0 (
            echo ✅ MySQL service started successfully
        ) else (
            echo ❌ Failed to start MySQL service
            echo Try running as administrator: "Run as administrator"
        )
    )
) else (
    echo ❌ MySQL service not found
    echo Please install MySQL Server
)

echo.
echo Step 3: Testing MySQL connection...
mysql -u root -e "SELECT 'Connection successful' as status;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL connection successful (no password)
    set "DB_PASSWORD="
) else (
    echo ⚠️  Testing with common passwords...
    mysql -u root -proot -e "SELECT 'Connection successful' as status;" 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MySQL connection successful (password: root)
        set "DB_PASSWORD=root"
    ) else (
        mysql -u root -ppassword -e "SELECT 'Connection successful' as status;" 2>nul
        if %ERRORLEVEL% EQU 0 (
            echo ✅ MySQL connection successful (password: password)
            set "DB_PASSWORD=password"
        ) else (
            echo ❌ Could not connect with common passwords
            echo Please enter your MySQL root password manually
            set /p DB_PASSWORD="Enter MySQL root password: "
        )
    )
)

echo.
echo Step 4: Creating database...
mysql -u root -p%DB_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS school_management;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Database created successfully
) else (
    echo ❌ Failed to create database
)

echo.
echo Step 5: Updating configuration...
echo DB_HOST=localhost > config.env
echo DB_USER=root >> config.env
echo DB_PASSWORD=%DB_PASSWORD% >> config.env
echo DB_NAME=school_management >> config.env
echo DB_PORT=3306 >> config.env
echo PORT=5001 >> config.env

echo ✅ Configuration updated in config.env

echo.
echo ========================================
echo MySQL Fix Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm run electron
echo 2. Or run: install-desktop.bat
echo.
pause
