
export interface IHttpClient {
  post<T, B = any>(path: string, body: B): AsyncResult<T, HttpClientError>
  get<T, P = any>(path: string, params?: P): AsyncResult<T, HttpClientError>
  setToken(token: string): void
  setErrorInterceptor(errorHandler: HttpClientErrorHandler): void
  call(config: HttpClientConfig): Promise<any>
}

export type HttpClientErrorHandler = (error: HttpClientError, config: HttpClientConfig) => Promise<any | null>

export type HttpClientConfig = {
  method: string
  url: string,
  body?: any,
  params?: any
}

export type HttpClientError = {
  type: string
  code: number
  message: string
}

export type ApiErrorData = {
  type: string,
  message: string
}