export type Errors = string[]
export type GoodFunctionResult<T> = { result: T; errors?: Errors }
export type BadFunctionResult<T> = { result?: T; errors: Errors }

export type FunctionResult<T> = GoodFunctionResult<T> | BadFunctionResult<T>

export const isGoodFunctionResult = <T>(
  fr: FunctionResult<T>
): fr is GoodFunctionResult<T> => (fr.errors?.length ?? 0) == 0
export const isBadFunctionResult = <T>(
  fr: FunctionResult<T>
): fr is BadFunctionResult<T> => (fr.errors?.length ?? 0) > 0
export interface Time {
  getTotalMiutes: () => number
  get: () => [number, number, number]
  formatTime: () => string
  formatAll: () => string
  add: (x: Time) => Time
  minus: (x: Time) => Time
  lessThan: (x: Time) => boolean
  formatWorkingDays: (hoursInADay: number) => string
  isFirstDay: () => boolean
}
export type CreateTimeSpanParams = {
  start: Time
  end: Time
  breaks?: Time
  comment?: string
}
export type Config = {
  consultant: {
    name: string
    position: string
    purchaseOrderNumber: string
  }
  reportTo: {
    name: string
    position: string
  }
  client: string
  defaultTimeSpan: CreateTimeSpanParams
}

export type ExceptedEntry = {
  date: Date
  timeSpan: CreateTimeSpanParams
}

export type CreateTimesheetParams = {
  createdAt: Date
  startedAt: Date
  countOfDays: number
  defaultTimeSpan: CreateTimeSpanParams
  exceptions?: ExceptedEntry[]
}
