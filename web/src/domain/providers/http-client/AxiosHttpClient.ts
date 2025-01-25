import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { injectable } from 'tsyringe';
import { ApiErrorData, HttpClientError, IHttpClient } from './IHttpClient';


@injectable()
export class AxiosHttpClient implements IHttpClient {

  private api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
  })

  async post<T, B>(path: string, body: B): AsyncResult<T, HttpClientError> {
    try {
      const resp = await this.api.post<T>(path, body, {})
      return Ok(resp.data)
    } catch (err) {
      const { response } = err as AxiosError<ApiErrorData>
      return Err(response?.data.type ?? '', {
        code: response?.status ?? 0,
        message: response?.data.message ?? '',
      })
    }
  }

  async get<T, P>(path: string, params?: P): AsyncResult<T, HttpClientError> {
    try {
      const resp = await this.api.get(path, {
        params,
      })
      return Ok(resp.data)
    } catch (err) {
      const { response } = err as AxiosError<ApiErrorData>
      return Err(response?.data.type ?? '', {
        code: response?.status ?? 0,
        message: response?.data.message ?? ''
      })
    }
  }

  setToken(token: string) {
    this.api.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    })
  }

  setUnauthorizedErrorInterceptor(callback: (errorData: ApiErrorData) => Promise<void>): void {
    const LIMIT = 3
    let attempts = 0
    this.api.interceptors.request.use(
      response => response,
      async (error: AxiosError<ApiErrorData>) => {
        const { response, config } = error
        if (error.status === 401 && attempts <= LIMIT) {
          await callback(response?.data as ApiErrorData)
          attempts++
          return this.api(config as AxiosRequestConfig<any>)
        }
        attempts = 0
        return Promise.reject(error);
      }
    )
  }


}