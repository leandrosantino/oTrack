
export interface IHttpClient {
  post<T, B = any>(path: string, body: B): AsyncResult<T, HttpClientError>
  get<T, P = any>(path: string, params?: P): AsyncResult<T, HttpClientError>
  setToken(token: string): void
  setErrorInterceptor(errorHandler: HttpClientErrorHandler): void
}

export type HttpClientErrorHandler = (error: HttpClientError & {
  config: {
    method: string
    url: string,
    body?: any,
    params?: any
  }
}) => Promise<any | null>

export type HttpClientError = {
  type: string
  code: number
  message: string
}

export type ApiErrorData = {
  type: string,
  message: string
}