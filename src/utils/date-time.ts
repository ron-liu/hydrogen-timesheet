import { format } from 'date-fns'
import { Time, FunctionResult, CreateTimeSpanParams } from '../types'
import { match } from 'ramda'

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
  const rex = /^[\s]*(?<startHour>\d{1,2})([\s]*\:[\s]*(?<startMin>\d{1,2}))?[\s]*to[\s]*(?<endHour>\d{1,2})([\s]*\:[\s]*(?<endMin>\d{1,2}))?([\s]*[\,][\s]*(?<breaksHour>\d{1,2})([\s]*\:[\s]*(?<breaksMin>\d{1,2}))?)?([\s]*[\,][\s]*(?<comment>[\s|\S]*))?/
  const matchs = str.match(rex)?.groups
  if (!matchs)
    return {
      errors: [
        'The format is not right, should be: start to end[, break[, comment]], like: 8:00 to 16:30, 00:30',
      ],
    }
  return {
    result: {
      start: createTime(
        parseInt(matchs.startHour),
        parseInt(matchs.startMin ?? '0')
      ),
      end: createTime(parseInt(matchs.endHour), parseInt(matchs.endMin ?? '0')),
      breaks: createTime(
        parseInt(matchs.breaksHour ?? '0'),
        parseInt(matchs.breaksMin ?? '0')
      ),
      comment: matchs.comment,
    },
  }
}
