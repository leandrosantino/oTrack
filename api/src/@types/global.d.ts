import { Exception } from 'shared/utils/Exception';

declare global {
  type Result<T, E extends Exception> = import('shared/Result/Result').Result<T, E>;
  type AsyncResult<T, E extends Exception> = import('shared/Result/Result').AsyncResult<T, E>;
  const Ok: typeof import('shared/Result/ResultHandler').Ok;
  const Err: typeof import('shared/Result/ResultHandler').Err;
}

export { };
