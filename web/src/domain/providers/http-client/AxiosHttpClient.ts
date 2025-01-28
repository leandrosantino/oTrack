import axios, { AxiosError } from 'axios';
import { singleton } from 'tsyringe';
import { ApiErrorData, HttpClientError, HttpClientErrorHandler, IHttpClient } from './IHttpClient';


@singleton()
export class AxiosHttpClient implements IHttpClient {

  token = ''

  private api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
  })

  async post<T, B>(path: string, body: B): AsyncResult<T, HttpClientError> {
    try {
      const resp = await this.api.post<T>(path, body, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      return Ok(resp.data)
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>
      const { response } = axiosError

      const resp = await this.errorInterceptor(axiosError)
      if (resp) return resp

      return Err({
        type: response?.data.type ?? '',
        code: response?.status ?? 0,
        message: response?.data.message ?? ''
      })
    }
  }

  async get<T, P>(path: string, params?: P): AsyncResult<T, HttpClientError> {
    try {
      const resp = await this.api.get(path, {
        params,
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      return Ok(resp.data)
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>
      const { response } = axiosError

      const resp = await this.errorInterceptor(axiosError)
      if (resp) return resp

      return Err({
        type: response?.data.type ?? '',
        code: response?.status ?? 0,
        message: response?.data.message ?? ''
      })
    }
  }

  setToken(token: string) {
    this.token = token
  }

  errorInterceptor: (err: AxiosError<ApiErrorData>) => Promise<any> = async () => { }

  setErrorInterceptor(errorHandler: HttpClientErrorHandler): void {
    this.errorInterceptor = async (error: AxiosError<ApiErrorData>) => {
      const axiosError = error as AxiosError<ApiErrorData>
      const { response } = axiosError

      return await errorHandler({
        type: response?.data.type ?? '',
        code: response?.status ?? 0,
        message: response?.data.message ?? '',
        config: {
          body: response?.config?.params?.body,
          params: response?.config?.params,
          url: response?.config?.url ?? '',
          method: response?.config.method ?? '',
        },
      })
    }

  }


}