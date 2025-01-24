import axios from 'axios';
import { injectable } from 'tsyringe';
import { IHttpClient } from './IHttpClient';


@injectable()
export class AxiosHttpClient implements IHttpClient{

  token = ''

  api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
  })

  async post<T, B>(path: string, body: B): Promise<T> {
    const {data} = await this.api.post(path, body, {
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    })
    return data
  }

  async get<T, P>(path: string, params?: P): Promise<T> {
    const {data} = await this.api.get(path, {
      params,
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    })
    return data
  }

  setToken(token: string){
    this.token = token
  }



}