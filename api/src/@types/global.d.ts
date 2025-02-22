import { Exception } from 'domain/result/Exception';

declare global {
  type Result<T, E extends Exception> = import('domain/result/Result').Result<T, E>;
  type AsyncResult<T, E extends Exception> = import('domain/result/Result').AsyncResult<T, E>;
  const Ok: typeof import('domain/result/ResultHandler').Ok;
  const Err: typeof import('domain/result/ResultHandler').Err;
}

export { };
