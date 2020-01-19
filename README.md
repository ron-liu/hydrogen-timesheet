# Hydrogen agent Timesheet creator

## To do

## Design of the command

- [ ] npx hydrogen-timesheet config --name "Ron Liu" --position Dev --purchaseOrderNumber 123456 --client "Awesome Company" --reportTo "John Whatever" --reportToPosition "DM" --defaultTimespan "8:30,16:30,0:30"
- [ ] npx hydrogen-timesheet create --createdAt "10/1" --startedAt "30/12/2019" --countOfDays 14
  1. After that it will prompt "Your default worktime span is: 8:30 to 16:30 and break 00:30, do you have any exceptions?"
  2. If yes, then prompt "Entry the exception, either type \"No or n\" or use the following format: \"date: startTime to endTime, break\", like: \"17/12/2019: 8:30 - 14:30, 00:30\""
