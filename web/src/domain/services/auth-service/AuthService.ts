import { User } from '@/domain/entities/User';
import { type IHttpClient } from '@/domain/providers/http-client/IHttpClient';
import { inject, injectable } from 'tsyringe';
import { IAuthService } from "./IAuthService";

@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject('HttpClient') private readonly httpClient: IHttpClient
  ) { }


  private async getLoginData(): Promise<User | null> {
    const userDataResult = await this.httpClient.get<User>('/user/profile')
    if (!userDataResult.ok) {
      throw new Error(userDataResult.err.data.message)
    }
    return userDataResult.value
  }

  async login(username: string, password: string): Promise<User | null> {
    const loginResult = await this.httpClient.post<string>('/auth/login', { username, password })

    if (!loginResult.ok) {
      throw new Error(loginResult.err.data.message)
    }

    if (loginResult.value) {
      this.httpClient.setToken(loginResult.value)

      return await this.getLoginData()
    }

    return null
  }

}