@echo off
echo ========================================
echo School Management System Database Setup
echo ========================================
echo.

echo Please make sure MySQL is installed and running.
echo.

echo Step 1: Creating database and tables...
echo Please enter your MySQL root password when prompted:
mysql -u root -p < server/database/schema.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database setup completed successfully!
    echo.
    echo Step 2: Update your database credentials in config.env
    echo - Change DB_PASSWORD to your actual MySQL password
    echo.
    echo Step 3: Start the application with: npm run dev:full
) else (
    echo.
    echo ❌ Database setup failed!
    echo Please check:
    echo - MySQL is running
    echo - You have the correct password
    echo - You have sufficient privileges
)

pause 