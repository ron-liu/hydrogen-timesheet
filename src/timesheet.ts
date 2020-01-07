import { TimeSpan, CreateTimeSpanParams, createTimeSpan } from './time-span'
import { Validator, validateParams } from './validate'
import {
  FunctionResult,
  Errors,
  isGoodFunctionResult,
  isBadFunctionResult,
  BadFunctionResult,
  GoodFunctionResult,
} from './types'
import { addDays, isWeekend, isSameDay, startOfDay, compareAsc } from 'date-fns'
import binarySearch from 'binary-search'
import { range, pipe, map, ifElse, isNil, filter, flatten, reduce } from 'ramda'
import { createDate } from './utils'
export const createTimesheet = (
  params: CreateTimesheetParams
): FunctionResult<Timesheet> => {
  const errors = validate(params)
  if (errors.length > 0) return { errors }
  const {
    countOfDays,
    startedAt,
    exceptions = [],
    defaultTimeSpan,
    createdAt,
  } = normaliseCreateTimesheetParams(params)
  const timeSpans = pipe(
    () => range(0, countOfDays),
    map(d => addDays(startedAt, d)),
    map<Date, FunctionResult<TimeSpan>>(
      ifElse(
        isWorkingDay,
        getTimeSpanForWorkingDay(exceptions, defaultTimeSpan),
        getTimeSpanForNonWorkingDay
      )
    )
  )()
  const timeSpansErrors = timeSpans
    .filter(x => isBadFunctionResult(x))
    .map(x => x.errors ?? [])
    .reduce((acc, x) => [...acc, ...x], [])
  console.log(122, timeSpans)
  console.log(2233, timeSpansErrors)
  console.log(4444, publicHolidays)

  if (timeSpansErrors.length > 0) {
    return { errors: timeSpansErrors }
  } else {
    return {
      result: {
        startedAt,
        createdAt,
        timeSpans: timeSpans.map(
          x => (x as GoodFunctionResult<TimeSpan>).result
        ),
        total: timeSpans
          .map(x => (x as GoodFunctionResult<TimeSpan>).result.totalWork)
          .reduce(
            (acc, x) => new Date(acc.getTime() + x.getTime()),
            new Date(0)
          ),
      },
    }
  }
}

const getTimeSpanForNonWorkingDay = (date: Date): FunctionResult<TimeSpan> => ({
  result: { comment: 'Weekend or Holiday', totalWork: new Date(0), date },
  errors: [],
})

const getExceptionTimeSpan = (exceptions: ExceptedEntry[]) => (
  day: Date
): ExceptedEntry | void => {
  const index = binarySearch(
    exceptions,
    day,
    (a, b) => a.date.getTime() - b.getTime()
  )
  if (index >= 0) return exceptions[index]
}

const getTimeSpanForWorkingDay = (
  exceptions: ExceptedEntry[],
  defaultTimeSpan: CreateTimeSpanParams
) => (date: Date) =>
  pipe<Date, ExceptedEntry | void, FunctionResult<TimeSpan>>(
    getExceptionTimeSpan(exceptions),
    ifElse(
      isNil,
      () => createTimeSpan(defaultTimeSpan, date),
      exception => createTimeSpan(exception.timeSpan, exception.date)
    )
  )(date)

const startDateShouldBeMonday: CreateTimesheetValidator = {
  message: x =>
    `startDate should be Monday, but it is NO.${x.startedAt.getDay()} of the week`,
  validate: x => x.startedAt.getDay() === 1,
}

const validate = validateParams([startDateShouldBeMonday])

const normaliseCreateTimesheetParams = (
  params: CreateTimesheetParams
): CreateTimesheetParams => {
  const { startedAt: startDate, exceptions = [] } = params
  return {
    ...params,
    startedAt: startDate,
    exceptions: exceptions.sort((a, b) => a.date.getTime() - b.date.getTime()),
  }
}

export type Timesheet = {
  createdAt?: Date
  startedAt: Date
  timeSpans: Array<TimeSpan>
  total: Date
}

const isWorkingDay = (day: Date): boolean => {
  return !isWeekend(day) && !isHoliday(day)

  function isHoliday(day: Date): boolean {
    return (
      binarySearch(publicHolidays, day, (a, b) => a.getTime() - b.getTime()) >=
      0
    )
  }
}

const publicHolidays = [
  createDate(2019, 12, 24),
  createDate(2019, 12, 25),
  createDate(2020, 1, 1),
  createDate(2020, 1, 27),
  createDate(2020, 3, 9),
  createDate(2020, 4, 10),
  createDate(2020, 4, 13),
  createDate(2020, 4, 25),
  createDate(2020, 6, 8),
  createDate(2020, 11, 3),
  createDate(2020, 12, 25),
  createDate(2020, 12, 28),
]

type ExceptedEntry = {
  date: Date
  timeSpan: CreateTimeSpanParams
}

type CreateTimesheetParams = {
  createdAt: Date
  startedAt: Date
  countOfDays: number
  defaultTimeSpan: CreateTimeSpanParams
  exceptions?: ExceptedEntry[]
}

type CreateTimesheetValidator = Validator<CreateTimesheetParams>
