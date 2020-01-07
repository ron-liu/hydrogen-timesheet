import { Errors } from "./types";
export type Validate<Type> = (x: Type) => boolean;
export type Validator<Type> = {
  validate: Validate<Type>;
  message: (x: Type) => string;
};

export type Validators<T> = Array<Validator<T>>;

type ValidateParams<Params> = (x: Params) => Errors;

export const validateParams = <Params>(validators: Validators<Params>) => (
  params: Params
): Errors => {
  return validators.reduce<Errors>((aggr, validator) => {
    return validator.validate(params)
      ? aggr
      : [...aggr, validator.message(params)];
  }, []);
};
