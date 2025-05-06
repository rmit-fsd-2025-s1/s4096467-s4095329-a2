cd /d %~dp0
cd teach-team-app
start cmd.exe /K npm run dev --window
cd ..
TIMEOUT /T 2
cd teach-team-backend
npm run dev
