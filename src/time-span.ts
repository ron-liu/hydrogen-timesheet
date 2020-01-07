import { Validator, validateParams } from './validate'
import { FunctionResult } from './types'
import { format } from 'date-fns'

export const createTimeSpan = (
  parmas: CreateTimeSpanParams,
  date: Date
): FunctionResult<TimeSpan> => {
  const errors = validate(parmas)
  if (errors.length > 0) return { errors }
  return { result: mapToTimeSpan(parmas, date) }
}

const mapToTimeSpan = (params: CreateTimeSpanParams, date: Date): TimeSpan => {
  const { start, end, breaks = new Date(0), comment = '' } = params
  const standardWork = new Date(8 * 3600 * 1000)
  const totalWork = new Date(end.getTime() - start.getTime() - breaks.getTime())
  const overwork =
    totalWork > standardWork
      ? new Date(totalWork.getTime() - standardWork.getTime())
      : new Date(0)
  return {
    date,
    start,
    end,
    breaks,
    standardWork,
    totalWork,
    overwork,
    comment,
  }
}

const startShouldBeIn19700101: CreateTimeSpanValidator = {
  validate: x => is19700101(x.start),
  message: x => `start should be in 1970-01-01 but is ${formatDate(x.start)}`,
}

const endShouldBeIn19700101: CreateTimeSpanValidator = {
  validate: x => is19700101(x.end),
  message: x => `end should be in 1970-01-01 but is ${formatDate(x.end)}`,
}

const endShouldGreaterThanStart: CreateTimeSpanValidator = {
  validate: x => x.start.getTime() < x.end.getTime(),
  message: x =>
    `end should greater than start, but start is ${formatDate(
      x.start
    )}, while end is ${formatDate(x.end)} `,
}

const breaksShouldLessThanTimeSpan: CreateTimeSpanValidator = {
  validate: x =>
    x.end.getTime() - x.start.getTime() > (x.breaks?.getDate() ?? 0),
  message: x => `timespan should greater than break`,
}

const validate = validateParams([
  startShouldBeIn19700101,
  endShouldBeIn19700101,
  endShouldGreaterThanStart,
  breaksShouldLessThanTimeSpan,
])

const is19700101 = (date: Date): boolean =>
  date.getTime() > 0 && date.getTime() < 3600 * 1000 * 24

const formatDate = (date: Date): string =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")

export type TimeSpan = {
  date: Date
  start?: Date
  end?: Date
  breaks?: Date
  standardWork?: Date
  overwork?: Date
  totalWork: Date
  comment: string
}

export type CreateTimeSpanParams = {
  start: Date
  end: Date
  breaks?: Date
  comment?: string
}

type CreateTimeSpanResult = FunctionResult<TimeSpan>

type CreateTimeSpanValidator = Validator<CreateTimeSpanParams>
