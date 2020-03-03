import { createTime, parseCreateTimeSpanParams } from '../date-time'

it('createTime should work', () => {
  const t = createTime(11, 45)
  expect(t).toMatchObject({
    days: 0,
    hours: 11,
    minutes: 45,
  })
})

it('createTime with overflow should work', () => {
  const t = createTime(23, 95)
  expect(t).toMatchObject({ days: 1, hours: 0, minutes: 35 })
})

it('add should work', () => {
  const t1 = createTime(1, 15)
  const t2 = createTime(2, 35)
  expect(t1.add(t2)).toMatchObject({ days: 0, hours: 3, minutes: 50 })
})

it('add with overflow should work', () => {
  const t1 = createTime(3, 15)
  const t2 = createTime(2, 35)
  expect(t1.add(t2)).toMatchObject({ days: 0, hours: 5, minutes: 50 })
})

it('formatTime should work', () => {
  const t = createTime(1, 15)
  expect(t.formatTime()).toEqual('1:15')
})

it('getWorkingdays should work', () => {
  const t1 = createTime(2, 30)
  expect(t1.formatWorkingDays(8)).toEqual('0.313d')

  const t2 = createTime(2, 30).add(createTime(7, 30))
  expect(t2.formatWorkingDays(8)).toEqual('1.25d')
})

it('parseCreateTimeParams should work', () => {
  expect(parseCreateTimeSpanParams('8 to 16:30, 00:30')).toMatchObject({
    result: {
      start: { hours: 8, minutes: 0 },
      end: { hours: 16, minutes: 30 },
      breaks: { hours: 0, minutes: 30 },
    },
  })
  expect(
    parseCreateTimeSpanParams('8:30 to 16, 00:30, I am too tired')
  ).toMatchObject({
    result: {
      start: { hours: 8, minutes: 30 },
      end: { hours: 16, minutes: 0 },
      breaks: { hours: 0, minutes: 30 },
      comment: 'I am too tired',
    },
  })
  expect(
    parseCreateTimeSpanParams(
      '   8   :     30      to      16,      00   :     30   ,      I am too tired'
    )
  ).toMatchObject({
    result: {
      start: { hours: 8, minutes: 30 },
      end: { hours: 16, minutes: 0 },
      breaks: { hours: 0, minutes: 30 },
      comment: 'I am too tired',
    },
  })
  expect(parseCreateTimeSpanParams('8:30 to 16')).toMatchObject({
    result: {
      start: { hours: 8, minutes: 30 },
      end: { hours: 16, minutes: 0 },
      breaks: { hours: 0, minutes: 0 },
    },
  })
})
