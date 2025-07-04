import axios from "axios";
import { HttpClient } from "./HttpCLient";
import { singleton } from "tsyringe";
import { AxiosError } from "axios";
import { HttpClientException } from "./HttpClientException";

@singleton()
export class AxiosHttpClient implements HttpClient {

  async get<T, E>(url: string): AsyncResult<T, HttpClientException<E>> {
    try {
      const response = await axios.get<T>(url);
      return Ok(response.data);
    } catch (err) {
      let error
      if (err instanceof AxiosError) err.response?.data
      return Err(new HttpClientException(error))
    }
  }

}
