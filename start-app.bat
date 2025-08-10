@echo off
REM Always switch to the folder where this script is located
cd /d "%~dp0"

echo Starting Tracking App (Backend + Frontend)...
echo.
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:8081
echo.
echo Press Ctrl+C in either window to stop the servers
echo.

REM Start backend in a new window
start "Backend Server" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in a new window
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:8080
echo.
echo Close this window when done.
pause
