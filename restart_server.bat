@echo off
echo Room Finder Server Management
echo ----------------------------
echo.

:menu
echo Choose an option:
echo 1. Start development servers (frontend + backend)
echo 2. Start backend server only
echo 3. Start frontend server only
echo 4. Start admin dashboard
echo 5. Run in debug mode
echo 6. Quit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto start_both
if "%choice%"=="2" goto start_backend
if "%choice%"=="3" goto start_frontend
if "%choice%"=="4" goto start_admin
if "%choice%"=="5" goto start_debug
if "%choice%"=="6" goto end

echo Invalid choice. Please try again.
echo.
goto menu

:start_both
echo.
echo Starting both frontend and backend servers...
echo.
start cmd /k "cd backend && node server.js"
start cmd /k "npm start"
echo Both servers started successfully!
goto end

:start_backend
echo.
echo Starting backend server only...
echo.
start cmd /k "cd backend && node server.js"
echo Backend server started successfully!
goto end

:start_frontend
echo.
echo Starting frontend server only...
echo.
start cmd /k "npm start"
echo Frontend server started successfully!
goto end

:start_admin
echo.
echo Starting admin dashboard...
echo.
start cmd /k "cd backend && node server.js"
start cmd /k "npm start"
echo Admin dashboard started! Navigate to /admin in your browser.
goto end

:start_debug
echo.
echo Starting servers in debug mode...
echo.
start cmd /k "cd backend && node --inspect server.js"
start cmd /k "set REACT_APP_DEBUG=true && npm start"
echo Debug mode activated! Use Chrome DevTools to connect to Node inspector.
goto end

:end
echo.
echo Server management complete.
