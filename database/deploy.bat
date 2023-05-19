@REM connect to the mysql database
mysql.exe -u root

@REM run deploy.sql
source deploy.sql

@REM run newcountries.sql
source newcountries.sql

@REM print done and wait for user input
echo Done!
pause