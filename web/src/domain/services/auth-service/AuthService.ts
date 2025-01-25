import { User } from '@/domain/entities/User';
import { type IHttpClient } from '@/domain/providers/http-client/IHttpClient';
import { inject, injectable } from 'tsyringe';
import { IAuthService } from "./IAuthService";

@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject('HttpClient') private readonly httpClient: IHttpClient
  ){}


  private async getLoginData(): Promise<User | null> {
    return await this.httpClient.get('/user/profile')
  }

  async login(username: string, password: string): Promise<User | null> {
    const accessToken = await this.httpClient.post<string>('/auth/login', {username, password})

    if (accessToken) {
      this.httpClient.setToken(accessToken)

      return await this.getLoginData()
    }

    return null
  }

}