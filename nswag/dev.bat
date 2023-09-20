set /p serverKey=Enter server-key:
"../node_modules/.bin/nswag" run "service.config-dev.nswag" /variables:serverKey=%serverKey%
pause