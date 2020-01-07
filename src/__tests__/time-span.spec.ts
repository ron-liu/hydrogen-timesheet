import { createTimeSpan } from '../time-span'
import { createTime } from '../utils'

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
  expect(timeSpan).toEqual({
    result: {
      date,
      start,
      end,
      breaks,
      standardWork: createTime(8),
      overwork: new Date(0),
      totalWork: createTime(8),
      comment,
    },
  })
})
