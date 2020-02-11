import { Command, Option } from 'commander'
import { prompt } from 'enquirer'
import { ConfigCommandArguments, ConfigCommandValue } from '../types'
import { parseCreateTimeSpanParams } from '../utils/date-time'
import Conf from 'conf'

const conf = new Conf()
const program = new Command()
const configArguments: ConfigCommandArguments = {
  fullName: { shortName: 'f', description: 'your name', required: true },
  position: { shortName: 'p', description: 'your position', required: true },
  purchaseOrderNumber: {
    shortName: 'o',
    description: 'purchae order number',
    required: true,
  },
  client: { shortName: 'c', description: 'your client', required: true },
  reportTo: { shortName: 'r', description: 'report to', required: true },
  reportToPosition: {
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
    .parse(process.argv)

  const config: Partial<ConfigCommandValue> = {}
  for (const [name, value] of Object.entries(configArguments)) {
    const { description, required, parse = (x: any) => x } = value
    const key = name as keyof ConfigCommandArguments
    if (!!program[name]) {
      config[key] = program[name]
      continue
    }
    const answer = (await prompt({
      type: 'input',
      name,
      message: `What is your ${description}?`,
      validate: (x: string) =>
        (required && !!x && !!parse(x)) || (!required && (!x || !!parse(x))),
    })) as any
    config[key] = answer[key]
  }
  conf.set(config)
  console.log(`Created config file located at ${conf.path}`)
}

run()
