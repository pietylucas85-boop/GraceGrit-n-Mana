@echo off
TITLE GGM DEPLOYMENT BUGFIX
COLOR 0A
echo =======================================================
echo          PUSHING BUG FIXES FOR GRACE GRIT 'N' MANA
echo =======================================================
cd /d "D:\GraceGrit-n-Mana"

echo 1. Adding Gemini API keys and fixed models to the repository...
git add services/geminiService.ts

echo 2. Committing changes...
git commit -m "Fix hallucinated gemini model issue and insert correct API key"

echo 3. Pushing to GitHub (This will automatically update the live website)...
git push

echo =======================================================
echo SUCCESS! Give it about 60-90 seconds to build.
echo Refresh https://ggm.digi-master.com and Grace will be back.
echo =======================================================
pause
