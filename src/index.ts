import { fillForm } from './fill'
import { Config, CreateTimesheetParams, isBadFunctionResult } from './types'
import { createTimesheet, Timesheet } from './timesheet'
import { createDate, createTime } from './utils'

const main = () => {
  const timesheet = createTimesheet(timesheetParams)
  if (isBadFunctionResult<Timesheet>(timesheet)) {
    console.error('Error occurs: ', timesheet.errors.join('\n'))
    process.exit(-1)
  }
  fillForm(config)(timesheet.result)
}

const config: Config = {
  consultant: {
    name: 'Ron Liu',
    position: 'Dev',
    purchaseOrderNumber: '100342',
  },
  client: 'Seek',
  reportTo: { name: 'Jamie Matcalfe', position: 'DM' },
  defaultTimeSpan: {
    start: createTime(8),
    end: createTime(16, 30),
    breaks: createTime(0, 30),
  },
}

const timesheetParams: CreateTimesheetParams = {
  countOfDays: 14,
  createdAt: new Date(),
  startedAt: createDate(2020, 1, 13),
  defaultTimeSpan: {
    start: createTime(8),
    end: createTime(16, 30),
    breaks: createTime(0, 30),
  },
  exceptions: [
    {
      date: createDate(2020, 1, 24),
      timeSpan: {
        start: createTime(8),
        end: createTime(15, 30),
        breaks: createTime(0, 30),
        comment: 'Left Office 12:30, WFH till 3:30pm',
      },
    },
    // {
    //   date: createDate(2019, 12, 20),
    //   timeSpan: {
    //     start: createTime(8),
    //     end: createTime(12),
    //     comment: 'Worked half day',
    //   },
    // },
  ],
}

main()
