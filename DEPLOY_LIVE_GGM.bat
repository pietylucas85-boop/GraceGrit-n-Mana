@echo off
TITLE GGM PULL AND FORCE DEPLOY
COLOR 0D
echo =======================================================
echo          SYNCING AND PUSHING CODE LIVE TO GITHUB
echo =======================================================
cd /d "D:\GraceGrit-n-Mana"

echo 1. Committing ALL local changes first to prepare for the merge...
git add .
git commit -m "Commit local unstaged files before syncing"

echo.
echo 2. Pushing the code up to the live GitHub repository (evezpulse-sys)...
git push -u origin main --force

echo.
echo =======================================================
echo DONE! GitHub is now building your site.
echo Give it about 60 to 90 seconds. 
echo Then go to https://ggm.digi-master.com and your app will be fixed.
echo =======================================================
pause
