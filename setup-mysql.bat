@echo off
echo ========================================
echo School Management System Database Setup
echo ========================================
echo.

echo Looking for MySQL installation...

set MYSQL_PATHS=^
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" ^
"C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe" ^
"C:\Program Files\MySQL\MySQL Server 8.2\bin\mysql.exe" ^
"C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe" ^
"C:\Program Files (x86)\MySQL\MySQL Server 8.1\bin\mysql.exe" ^
"C:\Program Files (x86)\MySQL\MySQL Server 8.2\bin\mysql.exe"

for %%i in (%MYSQL_PATHS%) do (
    if exist %%i (
        echo Found MySQL at: %%i
        echo.
        echo Creating database and tables...
        echo Please enter your MySQL root password when prompted:
        %%i -u root -p < server/database/schema.sql
        if !ERRORLEVEL! EQU 0 (
            echo.
            echo ✅ Database setup completed successfully!
            echo.
            echo You can now start the application with: npm run dev:full
        ) else (
            echo.
            echo ❌ Database setup failed!
            echo Please check your MySQL password and try again.
        )
        goto :end
    )
)

echo ❌ MySQL not found in common locations!
echo.
echo Please add MySQL to your PATH or update this script with the correct path.
echo Common MySQL installation paths:
echo - C:\Program Files\MySQL\MySQL Server 8.0\bin
echo - C:\Program Files\MySQL\MySQL Server 8.1\bin
echo - C:\Program Files\MySQL\MySQL Server 8.2\bin
echo.
echo Or manually run: mysql -u root -p < server/database/schema.sql

:end
pause 