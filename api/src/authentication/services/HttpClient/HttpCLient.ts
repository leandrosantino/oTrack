import { HttpClientException } from "./HttpClientException";

export interface HttpClient {
  get<T, E>(url: string, options?: any): AsyncResult<T, HttpClientException<E>>;
}
