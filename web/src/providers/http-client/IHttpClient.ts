
export interface IHttpClient {

  post<T, B>(path: string, body: B): Promise<T>
  get<T, P>(path: string, params?: P): Promise<T>
  
}