import {
  CreateCommandArguments,
  CommandArgument,
  CreateTimeSpanParams,
  ExceptedEntry,
  ExceptionArguments,
  isBadFunctionResult,
  Config,
  CreateTimesheetParams,
} from '../types'
import { parse, format } from 'date-fns'
import { validateRawConfg } from '../config/create-config'
import { initCommand, collectOptions } from 'src/utils/command'
import Conf from 'conf'
import { parseCreateTimeSpanParams, DATE_FORMAT } from 'src/utils/date-time'
import { prompt, Question } from 'inquirer'
import { createTimesheet, Timesheet } from 'src/time-sheet/timesheet'
import { fillForm } from 'src/pdf/fill'
import { CommanderStatic, Command } from 'commander'
type ExceptionStringParams = { date: string; timeSpan: string }
const run = async () => {
  const conf = new Conf()
  const errors = validateRawConfg(conf.store)
  const config = mapStoreToConfig(conf.store)
  if (errors.length > 0) {
    console.error('No Config found, run config command first')
    process.exit(-1)
  }

  const program = initCommand(createArguments)
  const createTimesheetParmas = await collectOptions(program, createArguments)
  const exceptions = await collectExceptions(program)
  const timesheet = createTimesheet(
    mapToTimesheet(createTimesheetParmas, exceptions, config.defaultTimeSpan)
  )
  if (isBadFunctionResult<Timesheet>(timesheet)) {
    console.error('Error occurs: ', timesheet.errors.join('\n'))
    process.exit(-1)
  }
  const outputFileName = fillForm(config)(timesheet.result)
  console.log(`Done, check ${outputFileName}`)
}

const collectExceptions = async (program: Command) => {
  let exceptions: ExceptionStringParams[] = []
  while (true) {
    const { more } = await prompt([morePrompt])
    if (!more) {
      break
    }
    const { date, timeSpan } = await collectOptions(program, exceptionsArgument)
    exceptions = [...exceptions, { date: date!, timeSpan: timeSpan! }]
    console.log(date, timeSpan)
  }
  return exceptions
}

export const mapToTimesheet = (
  createArgumentOptions: any,
  exceptions: ExceptionStringParams[],
  defaultTimeSpan: CreateTimeSpanParams
): CreateTimesheetParams => {
  const { countOfDays, createDate, startedAt } = createArgumentOptions
  return {
    countOfDays: parseInt(countOfDays!),
    createdAt: parse(createDate!, DATE_FORMAT, new Date()),
    defaultTimeSpan: defaultTimeSpan,
    startedAt: parse(startedAt!, DATE_FORMAT, new Date()),
    exceptions: exceptions.map(x => ({
      timeSpan: parseCreateTimeSpanParams(x.timeSpan).result!,
      date: parse(x.date, DATE_FORMAT, new Date()),
    })),
  }
}

export const mapStoreToConfig = (store: any): Config => {
  const {
    fullName,
    position,
    purchaseOrderNumber,
    client,
    reportTo,
    reportToPosition,
    defaultTimeSpan,
  } = store
  const createDefaultTimeSpan = parseCreateTimeSpanParams(defaultTimeSpan)
  return {
    consultant: { name: fullName, position, purchaseOrderNumber },
    client,
    reportTo: { name: reportTo, position: reportToPosition },
    defaultTimeSpan: createDefaultTimeSpan.result!,
  }
}

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

const exceptionsArgument: ExceptionArguments = {
  date: {
    type: 'input',
    shortName: 's',
    description: 'the exception date, d/M/yy',
    required: true,
    parse: (n: string) => {
      return parse(n, 'd/M/yy', new Date())
    },
  },
  timeSpan: {
    type: 'input',
    shortName: 'd',
    description:
      'exception time span, format: {start} to {end}[[, break], comment] like: 8:30 to 14:30, 00:30, leave early',
    required: true,
    parse: (s: string) => {
      const ret = parseCreateTimeSpanParams(s)
      if (!ret.errors) return ret.result!
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

const morePrompt: Question = {
  name: 'more',
  type: 'confirm',
  message: `Do you have more exceptions to entry?`,
}
run()
