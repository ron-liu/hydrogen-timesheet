import { Validator, validateParams } from './validate'
import { FunctionResult, CreateTimeSpanParams, Time } from './types'
import { format } from 'date-fns'
import { createTime } from './utils'

export const createTimeSpan = (
  parmas: CreateTimeSpanParams,
  date: Date
): FunctionResult<TimeSpan> => {
  const errors = validate(parmas)
  if (errors.length > 0) return { errors }
  return { result: mapToTimeSpan(parmas, date) }
}

const mapToTimeSpan = (params: CreateTimeSpanParams, date: Date): TimeSpan => {
  const { start, end, breaks = createTime(0), comment = '' } = params
  const totalWork = end.minus(start).minus(breaks)
  return {
    date,
    start,
    end,
    breaks,
    totalWork,
    comment,
  }
}

const startShouldBeIn19700101: CreateTimeSpanValidator = {
  validate: x => x.start.isFirstDay(),
  message: x => `start should be in first day but is ${x.start.formatAll()}`,
}

const endShouldBeIn19700101: CreateTimeSpanValidator = {
  validate: x => x.end.isFirstDay(),
  message: x => `end should be in 1970-01-01 but is ${x.end.formatTime()}`,
}

const endShouldGreaterThanStart: CreateTimeSpanValidator = {
  validate: x => x.start.lessThan(x.end),
  message: x =>
    `end should greater than start, but start is ${x.start.formatTime()}, while end is ${x.end.formatTime()} `,
}

const breaksShouldLessThanTimeSpan: CreateTimeSpanValidator = {
  validate: x => !x.breaks || x.breaks.lessThan(x.end.minus(x.start)),
  message: x => `timespan should greater than break`,
}

const validate = validateParams([
  startShouldBeIn19700101,
  endShouldBeIn19700101,
  endShouldGreaterThanStart,
  breaksShouldLessThanTimeSpan,
])

const formatDate = (date: Date): string =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")

export type TimeSpan = {
  date: Date
  start?: Time
  end?: Time
  breaks?: Time
  standardWork?: Time
  overwork?: Time
  totalWork: Time
  comment: string
}

type CreateTimeSpanResult = FunctionResult<TimeSpan>

type CreateTimeSpanValidator = Validator<CreateTimeSpanParams>
