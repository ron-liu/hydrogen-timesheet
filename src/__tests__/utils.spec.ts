import { createTime } from '../utils/date-time'

it('createTime should work', () => {
  const t = createTime(11, 45)
  expect(t.get()).toEqual([0, 11, 45])
})

it('createTime with overflow should work', () => {
  const t = createTime(23, 95)
  expect(t.get()).toEqual([1, 0, 35])
})

it('add should work', () => {
  const t1 = createTime(1, 15)
  const t2 = createTime(2, 35)
  expect(t1.add(t2).get()).toEqual([0, 3, 50])
})

it('add with overflow should work', () => {
  const t1 = createTime(3, 15)
  const t2 = createTime(2, 35)
  expect(t1.add(t2).get()).toEqual([0, 5, 50])
})

it('formatTime should work', () => {
  const t = createTime(1, 15)
  expect(t.formatTime()).toEqual('1:15')
})

it('getWorkingdays should work', () => {
  const t1 = createTime(2, 30)
  expect(t1.formatWorkingDays(8)).toEqual('0.3125')

  const t2 = createTime(2, 30).add(createTime(7, 30))
  expect(t2.formatWorkingDays(8)).toEqual(1.25)
})
