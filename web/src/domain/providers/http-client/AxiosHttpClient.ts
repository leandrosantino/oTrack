import axios, { AxiosError } from 'axios';
import { injectable } from 'tsyringe';
import { ApiErrorData, HttpClientError, IHttpClient } from './IHttpClient';


@injectable()
export class AxiosHttpClient implements IHttpClient {

  private token = ''

  private api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
  })

  async post<T, B>(path: string, body: B): AsyncResult<T, HttpClientError> {
    try {
      const resp = await this.api.post<T>(path, body, {
        headers: {
          'Authorization': 'Bearer ' + this.token
        }
      })
      return Ok(resp.data)
    } catch (err) {
      const { response } = err as AxiosError<ApiErrorData>
      return Err(response?.data.type ?? '', {
        code: Number(response?.status ?? '000'),
        message: response?.data.message ?? '',
      })
    }
  }

  async get<T, P>(path: string, params?: P): AsyncResult<T, HttpClientError> {
    try {
      const resp = await this.api.get(path, {
        params,
        headers: {
          'Authorization': 'Bearer ' + this.token
        }
      })
      return Ok(resp.data)
    } catch (err) {
      const { response } = err as AxiosError<ApiErrorData>
      return Err(response?.data.type ?? '', {
        code: Number(response?.status ?? '000'),
        message: response?.data.message ?? ''
      })
    }
  }

  setToken(token: string) {
    this.token = token
  }



}