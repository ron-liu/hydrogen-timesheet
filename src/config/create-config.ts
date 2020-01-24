import {
  FunctionResult,
  CreateTimeSpanParams,
  isGoodFunctionResult,
  Config,
} from '../types'
import { Validator, Validate, validateParams } from '../utils/validate'
import { parseCreateTimeSpanParams } from '../utils/date-time'

export const createConfig = (
  params: CreateConfigParams
): FunctionResult<Config> => {
  const errors = validateParams([requiredAll, defaultTimeSpanAreParsed])(params)
  if (errors.length > 0) {
    return { errors }
  }
  const {
    name,
    position,
    purchaseOrderNumber,
    reportTo,
    reportToPosition,
    defaultTimeSpan,
    client,
  } = params
  return {
    result: {
      consultant: { name, position, purchaseOrderNumber },
      reportTo: { name: reportTo, position: reportToPosition },
      client,
      defaultTimeSpan: parseCreateTimeSpanParams(defaultTimeSpan).result!,
    },
  }
}

type CreateConfigParams = {
  name: string
  position: string
  purchaseOrderNumber: string
  client: string
  reportTo: string
  reportToPosition: string
  defaultTimeSpan: string
}

const requiredAll: Validator<CreateConfigParams> = {
  validate: params => Object.values(params).every(x => !!x),
  message: params => `Not all property are provided`,
}

const defaultTimeSpanAreParsed: Validator<CreateConfigParams> = {
  validate: params =>
    isGoodFunctionResult(parseCreateTimeSpanParams(params.defaultTimeSpan)),
  message: params =>
    `The format is not right, should be: start to end[, break[, comment]], like: 8:00 to 16:30, 00:30`,
}
