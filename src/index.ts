import { Command, Option } from 'commander'
import { prompt } from 'enquirer'
import { TimeSpan } from './time-sheet/time-span'
import { CreateTimeSpanParams } from './types'

const program = new Command()

const run = async () => {
  program
    .command('config')
    .option('-n, --name <name>', 'your name')
    .option('-p --position <position>', 'your postion')
    .option(
      '-o --purchaseOrderNumber <purchaseOrderName>',
      'purchase order number'
    )
    .option('-c --client <client>', 'client')
    .option('-r --reportTo <reportTo>', 'report to')
    .option('-t --reportToPosition <reportToPosition>', 'position of report to')
    .option(
      '-d --defaultTimeSpan <defaultTimeSpan>',
      'default time span, format: {start} to {end}[, break], like: 8:30 to 14:30, 00:30'
    )
    .action(command => {
      const optionsMap = getOptionMap(command.options)
      console.log('options map', optionsMap)
    })

  program.parse(process.argv)
}
const getOptionMap = (ops: Option[]): Map<string, Option> =>
  ops.reduce(
    (m: Map<string, Option>, item: Option) =>
      m.set(item.long.replace('--', ''), item),
    new Map()
  )


run()
