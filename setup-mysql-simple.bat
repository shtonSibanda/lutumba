@echo off
echo ========================================
echo School Management System Database Setup
echo ========================================
echo.

echo Using MySQL from: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
echo.

echo Creating database and tables...
echo Please enter your MySQL root password when prompted:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < server/database/schema.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database setup completed successfully!
    echo.
    echo You can now start the application with: npm run dev:full
) else (
    echo.
    echo ❌ Database setup failed!
    echo Please check your MySQL password and try again.
)

pause 