import { Exception } from "lib/utils/Exception";

export interface HttpClient {
  get<T, E>(url: string, options?: any): AsyncResult<T, HttpClientException<E>>;
  post<T, B, E>(url: string, body: B, options?: any): AsyncResult<T, HttpClientException<E>>;
}

export class HttpClientException<T = any> extends Exception {
  constructor(data: T) {
    super({
      message: 'Http error',
      type: 'HTTP_CLIENT_ERROR',
      data: data
    })
  }
}
