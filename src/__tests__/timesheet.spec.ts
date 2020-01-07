import { createTimesheet } from '../timesheet'
import { createTime, createDate } from '../utils'

it('normal should work', () => {
  const timesheet = createTimesheet({
    countOfDays: 14,
    createdAt: new Date(),
    startedAt: createDate(2019, 12, 16),
    defaultTimeSpan: {
      start: createTime(8),
      end: createTime(16, 30),
      breaks: createTime(0, 30),
    },
    exceptions: [
      {
        date: createDate(2019, 12, 17),
        timeSpan: {
          start: createTime(8),
          end: createTime(14, 30),
          breaks: createTime(0, 30),
          comment: 'Left at 2:30pm',
        },
      },
      {
        date: createDate(2019, 12, 20),
        timeSpan: {
          start: createTime(8),
          end: createTime(12),
          comment: 'Worked half day',
        },
      },
    ],
  })
  expect(timesheet.errors).toBeUndefined()
  expect(timesheet.result?.timeSpans).toHaveLength(14)
  expect(timesheet.result?.total).toEqual(createTime(8 * 7 + 2))
})
