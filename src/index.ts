import { Command, Option } from 'commander'
import { prompt } from 'enquirer'
import { TimeSpan } from './time-sheet/time-span'
import {
  CreateTimeSpanParams,
  CommandArgument,
  ConfigCommandArguments,
  ConfigValue,
} from './types'
import { parseCreateTimeSpanParams } from './utils/date-time'

const program = new Command()
const configArguments: ConfigCommandArguments = {
  fullName: { shortName: 'f', description: 'your name', required: true },
  postion: { shortName: 'p', description: 'your position', required: true },
  purchaseOrderNumber: {
    shortName: 'o',
    description: 'purchae order number',
    required: true,
  },
  client: { shortName: 'c', description: 'your client', required: true },
  reportTo: { shortName: 'r', description: 'report to', required: true },
  reportToPostion: {
    shortName: 't',
    description: 'position of report to',
    required: true,
  },
  defaultTimeSpan: {
    shortName: 'd',
    description:
      'default time span, format: {start} to {end}[[, break], comment] like: 8:30 to 14:30, 00:30',
    required: true,
    parse: s => {
      const ret = parseCreateTimeSpanParams(s)
      if (!ret.errors) return ret.result!
    },
  },
}

const run = async () => {
  Object.entries(configArguments)
    .reduce(
      (command, [name, { shortName, description }]) =>
        command.option(`-${shortName}, --${name} <${name}>`, description),
      program
    )
    .action(async command => {
      const config: ConfigValue = {}
      for (const [name, value] of Object.entries(configArguments)) {
        const { description, required, parse = (x: any) => x } = value
        const key = name as keyof ConfigCommandArguments
        if (!!command[name]) {
          config[key] = command[name]
          continue
        }
        const answer = (await prompt({
          type: 'input',
          name,
          message: `What is your ${description}?`,
          validate: (x: string) =>
            (required && !!x && !!parse(x)) ||
            (!required && (!x || !!parse(x))),
        })) as any
        config[key] = answer[name]
      }
      console.log(config)
    })
  program.parse(process.argv)
}

run()
