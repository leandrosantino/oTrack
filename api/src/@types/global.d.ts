import { ErrorTypes } from 'interfaces/Result';

declare global {
  type Result<T, E extends ErrorTypes> = import('interfaces/Result').Result<T, E>;
  type AsyncResult<T, E extends ErrorTypes> = import('interfaces/Result').AsyncResult<T, E>;
  const Ok: typeof import('utils/ResultHandler').Ok;
  const Err: typeof import('utils/ResultHandler').Err;
}

export { };
