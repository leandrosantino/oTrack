
export interface IHttpClient {
  post<T, B = any>(path: string, body: B): AsyncResult<T, HttpClientError>
  get<T, P = any>(path: string, params?: P): AsyncResult<T, HttpClientError>
  setToken(token: string): void
  setExpiresTokenErrorInterceptor(callback: VoidFunction): void
}

export type HttpClientError = {
  code: number,
  message: string
}

export type ApiErrorData = {
  type: string,
  message: string
}