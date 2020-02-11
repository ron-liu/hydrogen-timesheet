import {
  FunctionResult,
  CreateTimeSpanParams,
  isGoodFunctionResult,
  Config,
  ConfigCommandValue,
} from '../types'
import { Validator, validateParams } from '../utils/validate'
import { parseCreateTimeSpanParams } from '../utils/date-time'

export const createConfig = (
  params: ConfigCommandValue
): FunctionResult<Config> => {
  const errors = validateParams([requiredAll, defaultTimeSpanAreParsed])(params)
  if (errors.length > 0) {
    return { errors }
  }
  const {
    fullName,
    position,
    purchaseOrderNumber,
    reportTo,
    reportToPosition,
    defaultTimeSpan,
    client,
  } = params
  return {
    result: {
      consultant: { name: fullName, position, purchaseOrderNumber },
      reportTo: { name: reportTo, position: reportToPosition },
      client,
      defaultTimeSpan: parseCreateTimeSpanParams(defaultTimeSpan).result!,
    },
  }
}

const requiredAll: Validator<ConfigCommandValue> = {
  validate: params => Object.values(params).every(x => !!x),
  message: () => `Not all property are provided`,
}

const defaultTimeSpanAreParsed: Validator<ConfigCommandValue> = {
  validate: params =>
    isGoodFunctionResult(parseCreateTimeSpanParams(params.defaultTimeSpan)),
  message: () =>
    `The format is not right, should be: start to end[, break[, comment]], like: 8:00 to 16:30, 00:30`,
}
