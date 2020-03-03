import { ConfigCommandArguments } from '../types'
import { parseCreateTimeSpanParams } from '../utils/date-time'
import { initCommand, collectOptions } from '../utils/command'
import Conf from 'conf'

const conf = new Conf()
const configArguments: ConfigCommandArguments = {
  fullName: {
    type: 'input',
    shortName: 'f',
    description: 'your name',
    required: true,
  },
  position: {
    type: 'input',
    shortName: 'p',
    description: 'your position',
    required: true,
  },
  purchaseOrderNumber: {
    type: 'input',
    shortName: 'o',
    description: 'purchae order number',
    required: true,
  },
  client: {
    type: 'input',
    shortName: 'c',
    description: 'your client',
    required: true,
  },
  reportTo: {
    type: 'input',
    shortName: 'r',
    description: 'report to',
    required: true,
  },
  reportToPosition: {
    type: 'input',
    shortName: 't',
    description: 'position of report to',
    required: true,
  },
  defaultTimeSpan: {
    type: 'input',
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
  const program = initCommand(configArguments)
  const config = await collectOptions(program, configArguments)
  conf.set(config)
  console.log(`Created config file located at ${conf.path}`)
}

run()
