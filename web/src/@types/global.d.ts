declare global {
  type Result<T, E> = import('@/domain/interfaces/Result').Result<T, E>;
  type AsyncResult<T, E> = import('@/domain/interfaces/Result').AsyncResult<T, E>;
  const Ok: typeof import('@/lib/result-handler').Ok;
  const Err: typeof import('@/lib/result-handler').Err;
}

export { };

