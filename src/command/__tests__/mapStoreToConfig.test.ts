import { mapStoreToConfig } from '../create'
import { createTime } from 'src/utils/date-time'

it('should map correctly', () => {
  const store = {
    fullName: 'ron',
    position: 'dev',
    purchaseOrderNumber: '13432',
    client: 'seek',
    reportTo: 'jmet',
    reportToPosition: 'dm',
    defaultTimeSpan: '8 to 14:30, 00:30',
  }
  const recieved = mapStoreToConfig(store)
  expect(recieved).toMatchObject({
    consultant: {
      name: 'ron',
      position: 'dev',
      purchaseOrderNumber: '13432',
    },
    client: 'seek',
    reportTo: { name: 'jmet', position: 'dm' },
  })
  expect(recieved.defaultTimeSpan.start.formatAll()).toEqual(
    createTime(8).formatAll()
  )
  expect(recieved.defaultTimeSpan.end.formatAll()).toEqual(
    createTime(14, 30).formatAll()
  )
  expect(recieved.defaultTimeSpan.breaks!.formatAll()).toEqual(
    createTime(0, 30).formatAll()
  )
  expect(recieved.defaultTimeSpan.comment).toBeUndefined()
})
