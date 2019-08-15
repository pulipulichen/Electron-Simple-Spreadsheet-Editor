cd /D "%~dp0"
cd ..
echo %1 
electron electron/main.js --mode production --file "%1"