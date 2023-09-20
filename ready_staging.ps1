cd nswag/
cmd.exe /c staging.bat
cd ..
echo nswag complete
cd src/app/shared/
powershell -Command "(gc AppConsts.ts) -replace 'http://localhost:8999', 'https://qrscanner.serviceendpoints.co.za' | Out-File -encoding ASCII AppConsts.ts"
cd ../services/push-notification/
powershell -Command "(gc push-notification.service.ts) -replace 'http://localhost:8999', 'https://qrscanner.serviceendpoints.co.za' | Out-File -encoding ASCII push-notification.service.ts"
cmd /c pause
