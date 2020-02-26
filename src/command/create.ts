import {
  CreateCommandArguments,
  CommandArgument,
  CreateTimeSpanParams,
} from '../types'
import { parse, format } from 'date-fns'
import { validateRawConfg } from 'src/config/create-config'
import { initCommand, collectOptions } from 'src/utils/command'
import Conf from 'conf'
import { parseCreateTimeSpanParams } from 'src/utils/date-time'
import { prompt } from 'enquirer'

const run = async () => {
  const errors = validateRawConfg(conf.store)
  if (errors.length > 0) {
    console.error('No Config found, run config command first')
    process.exit(-1)
  }

  const program = initCommand(createArguments)
  const createOptions = await collectOptions(program, createArguments)
  prompt({})
}

const conf = new Conf()
const createArguments: CreateCommandArguments = {
  countOfDays: {
    type: 'input',
    shortName: 'c',
    description: 'count of days (1-14)',
    required: true,
    parse: (n: string) => {
      const r = parseInt(n)
      if (!r || r > 14 || r < 1) return undefined
      return r
    },
    defaultValue: '14',
  },
  createDate: {
    type: 'input',
    shortName: 'c',
    description: 'date created, d/M/yy',
    defaultValue: format(new Date(), 'd/M/yy'),
    required: true,
    parse: (n: string) => {
      return parse(n, 'd/M/yy', new Date())
    },
  },
  startedAt: {
    type: 'input',
    shortName: 's',
    description: 'date started, d/M/yy',
    defaultValue: format(new Date(), 'd/M/yy'),
    required: true,
    parse: (n: string) => {
      return parse(n, 'd/M/yy', new Date())
    },
  },
}

const exceptionPrompt: CommandArgument<CreateTimeSpanParams> = {
  type: 'input',
  shortName: 'd',
  description:
    'exception time span, format: {start} to {end}[[, break], comment] like: 8:30 to 14:30, 00:30, leave early',
  required: true,
  parse: (s: string) => {
    const ret = parseCreateTimeSpanParams(s)
    if (!ret.errors) return ret.result!
  },
}

const morePrompt: CommandArgument<boolean> = {
  type: 'toggle',
  shortName: 'd',
  description:
    'exception time span, format: {start} to {end}[[, break], comment] like: 8:30 to 14:30, 00:30, leave early',
  required: true,
}
run()
