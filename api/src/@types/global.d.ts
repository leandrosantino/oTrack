import { Exception } from 'lib/utils/Exception';

declare global {
  type Result<T, E extends Exception> = import('lib/utils/Result').Result<T, E>;
  type AsyncResult<T, E extends Exception> = import('lib/utils/Result').AsyncResult<T, E>;
  const Ok: typeof import('lib/utils/Result').Ok;
  const Err: typeof import('lib/utils/Result').Err;
  const tryAsync: typeof import('lib/utils/Result').tryAsync;
  const trySync: typeof import('lib/utils/Result').trySync;
  const properties: import('lib/utils/properties').Properties;
}

export { };
