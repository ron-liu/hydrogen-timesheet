import { ConfigCommandArguments } from '../types'
import { parseCreateTimeSpanParams } from '../utils/date-time'
import { initCommand, collectOptions } from '../utils/command'
import Conf from 'conf'

const conf = new Conf()
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
  const program = initCommand(configArguments)
  const config = await collectOptions(program, configArguments)
  conf.set(config)
  console.log(`Created config file located at ${conf.path}`)
}

run()
