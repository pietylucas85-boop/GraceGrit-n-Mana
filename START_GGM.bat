@echo off
TITLE STARTUP // Grace, Grit 'n' Mana (GGM)
COLOR 0D
echo =======================================================
echo          IGNITING GRACE, GRIT 'N' MANA
echo =======================================================

cd /d "D:\GraceGrit-n-Mana"

echo [1/3] Checking Dependencies...
call npm install

echo [2/3] Starting Vite Server on Port 5174...
start "GGM FRONTEND" cmd /c "npm run dev -- --port 5174"

echo [3/3] Waiting 3 seconds for Server to Boot...
timeout /t 3 /nobreak >nul

echo Opening Interface in your browser...
start http://localhost:5174
exit
