import { Command } from "commander"
import { TimeSpan } from "./time-sheet/time-span"

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
  readonly totalMiutes: number
  readonly days: number
  readonly hours: number
  readonly minutes: number
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

export type CommandArgument<T> = {
  // name: string,
  shortName: string,
  description: string,
  required: string,
  parse?: (x: string) => T,
  value: T
}

export type ConfigCommandArguments = {
  name: CommandArgument<string>,
  postion: CommandArgument<string>,
  purchaseOrderNumber: CommandArgument<string>,
  client: CommandArgument<string>,
  reportTo: CommandArgument<string>,
  reportToPostion: CommandArgument<String>,
  defaultTimeSpan: CommandArgument<TimeSpan>
}
