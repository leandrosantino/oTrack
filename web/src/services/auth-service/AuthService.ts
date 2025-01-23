import { type IHttpClient } from '@/providers/http-client/IHttpClient';
import { inject, injectable } from 'tsyringe';
import { IAuthService } from "./IAuthService";

@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject('HttpClient') private readonly httpClient: IHttpClient
  ){}

  async getLoginData(): Promise<any> {
    return await this.httpClient.get('/user/profile')
  }

  async login(username: string, password: string): Promise<string> {
    return await this.httpClient.post('/auth/login', {username, password})
  }

}