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
  expect(mapStoreToConfig(store)).toEqual({
    consultant: {
      name: 'ron',
      position: 'Dev',
      purchaseOrderNumber: '13432',
    },
    client: 'seek',
    reportTo: { name: 'jmet', position: 'DM' },
    defaultTimeSpan: {
      start: createTime(8),
      end: createTime(14, 30),
      breaks: createTime(0, 30),
    },
  })
})
