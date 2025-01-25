
export interface IHttpClient {

  post<T, B = any>(path: string, body: B): Promise<T>
  get<T, P = any>(path: string, params?: P): Promise<T>
  setToken(token: string): void
}