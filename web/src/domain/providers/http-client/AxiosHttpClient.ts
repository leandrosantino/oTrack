import axios, { AxiosError } from 'axios';
import { singleton } from 'tsyringe';
import { ApiErrorData, HttpClientError, IHttpClient } from './IHttpClient';


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

      this.refreshToken(axiosError)

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
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      return Ok(resp.data)
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>
      const { response } = axiosError

      this.refreshToken(axiosError)

      return Err(response?.data.type ?? '', {
        code: response?.status ?? 0,
        message: response?.data.message ?? ''
      })
    }
  }

  private async refreshToken(err: AxiosError<ApiErrorData>) {
    const { response, config } = err as AxiosError<ApiErrorData>
    if (
      !config?.url?.includes('refresh') &&
      response?.status === 401 &&
      response.data.type === 'EXPIRED_TOKEN'
    ) {
      try {
        const { data, status } = await this.api.get('/auth/refresh')
        if (status === 200) {
          this.setToken(data)
          switch (config?.method) {
            case 'get': return await this.get(config?.url ?? '', config?.params)
            case 'post': return await this.post(config?.url ?? '', config?.params.body)
            default: break;
          }
          return await this.post(config?.url ?? '', config?.params.body)
        }
      } catch { }
    }
  }

  setToken(token: string) {
    this.token = token
  }

  setExpiresTokenErrorInterceptor(callback: VoidFunction): void {
    this.api.interceptors.response.use(
      response => {
        return response
      },
      (error: AxiosError<ApiErrorData>) => {
        const { response, config } = error
        if (config?.url?.includes('refresh') && response?.data.type === 'EXPIRED_TOKEN') {
          console.log('error sndolkjnsakd')
          callback()
        }
        return Promise.reject(error);
      }
    )
  }


}