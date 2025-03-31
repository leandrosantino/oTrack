import { ValidationException } from "./ValidatorException";

export interface Validator<T> {
  parse(data: T): Result<T, ValidationException>;
}
