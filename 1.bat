taskkill /IM chrome.exe /F

start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --profile-directory="Default" --guest --remote-debugging-port=9222

node main.js 1

taskkill /IM chrome.exe /F