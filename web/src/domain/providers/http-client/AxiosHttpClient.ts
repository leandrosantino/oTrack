import axios, { AxiosError } from 'axios';
import { singleton } from 'tsyringe';
import { ApiErrorData, HttpClientConfig, HttpClientError, HttpClientErrorHandler, IHttpClient } from './IHttpClient';


@singleton()
export class AxiosHttpClient implements IHttpClient {

  #token = ''

  #api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
  })

  async post<T, B>(path: string, body: B): AsyncResult<T, HttpClientError> {
    try {
      const resp = await this.#api.post<T>(path, body, {
        headers: {
          Authorization: `Bearer ${this.#token}`
        }
      })
      return Ok(resp.data)
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>
      const { response } = axiosError

      return Err({
        type: response?.data.type ?? '',
        code: response?.status ?? 0,
        message: response?.data.message ?? ''
      })
    }
  }

  async put<T, B>(path: string, body: B): AsyncResult<T, HttpClientError> {
    try {
      const resp = await this.#api.put<T>(path, body, {
        headers: {
          Authorization: `Bearer ${this.#token}`
        }
      })
      return Ok(resp.data)
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>
      const { response } = axiosError

      return Err({
        type: response?.data.type ?? '',
        code: response?.status ?? 0,
        message: response?.data.message ?? ''
      })
    }
  }

  async get<T, P>(path: string, params?: P): AsyncResult<T, HttpClientError> {
    try {
      const resp = await this.#api.get(path, {
        params,
        headers: {
          Authorization: `Bearer ${this.#token}`
        }
      })
      return Ok(resp.data)
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>
      const { response } = axiosError

      return Err({
        type: response?.data.type ?? '',
        code: response?.status ?? 0,
        message: response?.data.message ?? ''
      })
    }
  }

  setToken(token: string) {
    this.#token = token
  }

  async call(config: HttpClientConfig): Promise<any> {
    return await this.#api({
      url: config.url,
      method: config.method,
      params: {
        ...config.params,
        body: config.body
      },
      headers: {
        Authorization: `Bearer ${this.#token}`
      }
    })
  }

  setErrorInterceptor(errorHandler: HttpClientErrorHandler): void {
    this.#api.interceptors.response.use(
      response => response,
      async (error: AxiosError<ApiErrorData>) => {
        const axiosError = error as AxiosError<ApiErrorData>
        const { response } = axiosError

        const handlerResponse = await errorHandler({
          type: response?.data.type ?? '',
          code: response?.status ?? 0,
          message: response?.data.message ?? ''
        }, {
          body: response?.config?.params?.body,
          params: response?.config?.params,
          url: response?.config?.url ?? '',
          method: response?.config.method ?? '',
        })

        if (handlerResponse !== null) {
          return handlerResponse
        }

        return Promise.reject(error)
      }
    )

  }


}