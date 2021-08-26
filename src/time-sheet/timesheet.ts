import { TimeSpan, createTimeSpan } from './time-span'
import { Validator, validateParams } from '../utils/validate'
import {
  FunctionResult,
  isBadFunctionResult,
  GoodFunctionResult,
  CreateTimeSpanParams,
  CreateTimesheetParams,
  ExceptedEntry,
  Time,
} from '../types'
import { addDays, isWeekend } from 'date-fns'
import binarySearch from 'binary-search'
import { range, pipe, map, ifElse, isNil } from 'ramda'
import { createDate, createTime } from '../utils/date-time'

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
    map((d) => addDays(startedAt, d)),
    map<Date, FunctionResult<TimeSpan>>(
      ifElse(
        isWorkingDay,
        getTimeSpanForWorkingDay(exceptions, defaultTimeSpan),
        getTimeSpanForNonWorkingDay
      )
    )
  )()
  const timeSpansErrors = timeSpans
    .filter((x) => isBadFunctionResult(x))
    .map((x) => x.errors ?? [])
    .reduce((acc, x) => [...acc, ...x], [])

  if (timeSpansErrors.length > 0) {
    return { errors: timeSpansErrors }
  } else {
    return {
      result: {
        startedAt,
        createdAt,
        timeSpans: timeSpans.map(
          (x) => (x as GoodFunctionResult<TimeSpan>).result
        ),
        total: timeSpans
          .map((x) => (x as GoodFunctionResult<TimeSpan>).result.totalWork)
          .reduce((acc, x) => acc.add(x), createTime(0)),
      },
    }
  }
}

const getTimeSpanForNonWorkingDay = (date: Date): FunctionResult<TimeSpan> => ({
  result: {
    comment: 'weekend/holiday/mandatory leave',
    totalWork: createTime(0),
    date,
  },
  errors: [],
})

const getExceptionTimeSpan =
  (exceptions: ExceptedEntry[]) =>
  (day: Date): ExceptedEntry | void => {
    const index = binarySearch(
      exceptions,
      day,
      (a, b) => a.date.getTime() - b.getTime()
    )
    if (index >= 0) return exceptions[index]
  }

const getTimeSpanForWorkingDay =
  (exceptions: ExceptedEntry[], defaultTimeSpan: CreateTimeSpanParams) =>
  (date: Date) =>
    pipe<Date, ExceptedEntry | void, FunctionResult<TimeSpan>>(
      getExceptionTimeSpan(exceptions),
      ifElse(
        isNil,
        () => createTimeSpan(defaultTimeSpan, date),
        (exception) => createTimeSpan(exception.timeSpan, exception.date)
      )
    )(date)

const startDateShouldBeMonday: CreateTimesheetValidator = {
  message: (x) =>
    `startDate should be Monday, but it is NO.${x.startedAt.getDay()} of the week`,
  validate: (x) => x.startedAt.getDay() === 1,
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
  createdAt: Date
  startedAt: Date
  timeSpans: Array<TimeSpan>
  total: Time
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
  createDate(2020, 5, 4),
  createDate(2020, 5, 18),
  createDate(2020, 6, 8),
  createDate(2020, 6, 29),
  createDate(2020, 10, 23),
  createDate(2020, 11, 3),
  createDate(2020, 12, 25),
  createDate(2020, 12, 28),
  createDate(2021, 1, 1),
  createDate(2021, 1, 26),
  createDate(2021, 1, 29),
  createDate(2021, 2, 1),
  createDate(2021, 2, 2),
  createDate(2021, 2, 3),
  createDate(2021, 2, 4),
  createDate(2021, 2, 5),
  createDate(2021, 3, 8),
  createDate(2021, 4, 2),
  createDate(2021, 4, 5),
  createDate(2021, 6, 14),
  createDate(2021, 7, 2),
]

type CreateTimesheetValidator = Validator<CreateTimesheetParams>
