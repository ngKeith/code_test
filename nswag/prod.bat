set /p serverKey=Enter server-key:
"../node_modules/.bin/nswag" run "service.config.nswag" /variables:serverKey=%serverKey%
pause