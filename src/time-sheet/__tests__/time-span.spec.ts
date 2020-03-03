import { createTimeSpan } from '../time-span'
import { createTime } from '../../utils/date-time'

it('createTimeSpan should work', () => {
  const date = new Date(2019, 11, 24)
  const start = createTime(8)
  const end = createTime(16, 30)
  const comment = 'normal'
  const breaks = createTime(0, 30)
  const timeSpan = createTimeSpan(
    {
      start,
      end,
      breaks: createTime(0, 30),
      comment,
    },
    date
  )
  expect(timeSpan).toMatchObject({
    result: {
      date,
      start: { hours: 8 },
      end: { hours: 16 },
      breaks: { hours: 0, minutes: 30 },
      totalWork: { hours: 8, minutes: 0 },
      comment,
    },
  })
})
