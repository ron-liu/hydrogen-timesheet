import { createTimesheet } from '../timesheet'
import { createTime } from '../utils'

it('normal should work', () => {
  const timesheet = createTimesheet({
    countOfDays: 14,
    createdAt: new Date(),
    startedAt: new Date(2019, 11, 16),
    defaultTimeSpan: {
      start: createTime(8),
      end: createTime(16, 30),
      breaks: createTime(0, 30),
    },
    exceptions: [
      {
        date: new Date(2019, 11, 17),
        timeSpan: {
          start: createTime(8),
          end: createTime(14, 30),
          breaks: createTime(0, 30),
          comment: 'Left at 2:30pm',
        },
      },
      {
        date: new Date(3029, 11, 20),
        timeSpan: {
          start: createTime(8),
          end: createTime(12),
          comment: 'Worked half day',
        },
      },
    ],
  })
  expect(timesheet.errors).toHaveLength(0)
  expect(timesheet.result?.timeSpans).toHaveLength(14)
  expect(timesheet.result?.total).toEqual(createTime(8 * 7 + 2))
})
