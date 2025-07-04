import { Exception } from "shared/utils/Exception";

export class HttpClientException<T = any> extends Exception {
  constructor(data: T) {
    super({
      message: 'Http error',
      type: 'HTTP_CLIENT_ERROR',
      data: data
    })
  }
}
