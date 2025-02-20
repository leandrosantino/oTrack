
export interface Validator<T> {
  parse(data: T): Result<T, ValidationExceptions>;
}

export enum ValidationExceptions {
  INVALID_DATA = 'INVALID_DATA'
}
