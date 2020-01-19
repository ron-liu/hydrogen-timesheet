import { format } from 'date-fns'
import { Time, FunctionResult, CreateTimeSpanParams } from '../types'

export const createTime = (hours: number, minutes: number = 0): Time => {
  const date: [number, number, number] = [
    Math.floor((hours + Math.floor(minutes / 60)) / 24),
    (hours + Math.floor(minutes / 60)) % 24,
    minutes % 60,
  ]
  const _totalMinutes = hours * 60 + minutes
  const _days = Math.floor(_totalMinutes / (24 * 60))
  const _hours = Math.floor((_totalMinutes % (24 * 60)) / 60)
  const _minutes = _totalMinutes % 60
  return {
    totalMiutes: _totalMinutes,
    days: _days,
    hours: _hours,
    minutes: _minutes,
    formatTime: () =>
      _hours !== 0 || _minutes !== 0
        ? `${_hours}:${_minutes.toString().padStart(2, '0')}`
        : '',
    formatAll: () =>
      `${_days}d ${_hours}:${_minutes.toString().padStart(2, '0')}`,
    add: x => {
      const { days: xDay, hours: xHours, minutes: xMinutes } = x
      return createTime(
        xHours + _hours + (xDay + _days) * 24,
        xMinutes + _minutes
      )
    },
    minus: x => {
      const { days: xDay, hours: xHours, minutes: xMinutes } = x
      return createTime(
        _hours - xHours + (_days - xDay) * 24,
        _minutes - xMinutes
      )
    },
    formatWorkingDays: hoursInADay => {
      return `${(_days * 24 + _hours + _minutes / 60) / hoursInADay} d`
    },
    lessThan: x => _totalMinutes < x.totalMiutes,
    isFirstDay: () => _days === 0,
  }
}

export const createDate = (y: number, m: number, d: number): Date =>
  new Date(y, m - 1, d)

export const parseCreateTimeSpanParams = (
  str: string
): FunctionResult<CreateTimeSpanParams> => {
  return {
    result: {
      start: createTime(8, 0),
      end: createTime(16, 30),
      breaks: createTime(0, 30),
    },
  }
}
