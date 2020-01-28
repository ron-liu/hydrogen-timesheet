import { Command, Option } from 'commander'
import { prompt } from 'enquirer'
import { TimeSpan } from './time-sheet/time-span'
import {  CreateTimeSpanParams, CommandArgument, ConfigCommandArguments } from './types'
import { parseCreateTimeSpanParams } from './utils/date-time'


const program = new Command()
const configArguments: ConfigCommandArguments =  {
  name: {shortName: 'n', description: 'your name', }
}
  


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
<<<<<<< HEAD
      'default time span, format: {start} to {end}[, break], like: 8:30 to 14:30, 00:30'
    )
    .action(command => {
      const optionsMap = getOptionMap(command.options)
      console.log('options map', optionsMap)
    })

  program.parse(process.argv)
=======
      'default time span, format: {start} to {end}[[, break], comment] like: 8:30 to 14:30, 00:30, left 30m earlier',
      s => { 
        const ret = parseCreateTimeSpanParams(s)
        if (!ret.errors) return ret.result!
      }
    )
    .action(async command => {
      console.log(command.options)
      const optionsMap = getOptionMap(command.options, program)
      for (const [k, v] of optionsMap) {
        // if (!v.value) {
        //   const response = await prompt({
        //     type: 'input',
        //     name: 'username',
        //     message: 'What is your username?'
        //   });
        // }

      }
    })

  program.parse(process.argv)
}
const getOptionMap = (ops: Option[], program: Command): Map<string, Argument> =>
  ops.reduce(
    (m, { description, long }: Option) => {
      const name = long.replace('--', '')
      m.set(name, { description, value: program[name] })
      return m
    },
    new Map()
  )
type Argument = {
  description: string,
  value: any
>>>>>>> 74e8940ddf8a38de20a8384eea5390496fa3d094
}
const getOptionMap = (ops: Option[]): Map<string, Option> =>
  ops.reduce(
    (m: Map<string, Option>, item: Option) =>
      m.set(item.long.replace('--', ''), item),
    new Map()
  )


run()
