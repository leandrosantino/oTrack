import { Exception } from 'utils/Exception';

declare global {
  type Result<T, E extends Exception> = import('interfaces/Result').Result<T, E>;
  type AsyncResult<T, E extends Exception> = import('interfaces/Result').AsyncResult<T, E>;
  const Ok: typeof import('utils/ResultHandler').Ok;
  const Err: typeof import('utils/ResultHandler').Err;
}

export { };
