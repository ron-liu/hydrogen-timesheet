import program from 'commander'
program
  .version('0.0.1')
  .description('Hydrogen timesheet filler')
  .command('config', 'Config settings', { executableFile: 'command/config' })
  .alias('c')
  .parse(process.argv)
