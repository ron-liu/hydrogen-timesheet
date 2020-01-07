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
