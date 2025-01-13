declare global {
  type Result<T, E> = import('entities/types/Result').Result<T, E>;
  const Ok: typeof import('entities/types/Result').Ok;
  const Err: typeof import('entities/types/Result').Err;
}

export { };
