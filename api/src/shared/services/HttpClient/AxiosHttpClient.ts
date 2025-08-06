import axios from "axios";
import { HttpClient, HttpClientException } from "./HttpCLient";
import { singleton } from "tsyringe";
import { AxiosError } from "axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AxiosHttpClient implements HttpClient {

  async get<T, E>(url: string): AsyncResult<T, HttpClientException<E>> {
    try {
      const response = await axios.get<T>(url);
      return Ok(response.data);
    } catch (err) {
      let error: any
      if (err instanceof AxiosError) error = err.response?.data
      return Err(new HttpClientException(error))
    }
  }

  async post<T, B, E>(url: string, body: B): AsyncResult<T, HttpClientException<E>> {
    try {
      const response = await axios.post<T>(url, body);
      return Ok(response.data);
    } catch (err) {
      let error: any
      if (err instanceof AxiosError) error = err.response?.data
      return Err(new HttpClientException(error))
    }
  }

}
