cd /D "%~dp0"
cd ..
echo %1 
electron main.js --mode production --file "%1"