import { User } from '@/domain/entities/User';
import { type IHttpClient } from '@/domain/providers/http-client/IHttpClient';
import { inject, injectable } from 'tsyringe';
import { IAuthService } from "./IAuthService";

@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject('HttpClient') private readonly httpClient: IHttpClient
  ) { }

  onRefreshToken(callback: (error?: any) => void) {
    this.httpClient.setUnauthorizedErrorInterceptor(async (error) => {
      let success = false
      try {
        await this.restoreSession()
        success = true
      } catch { }
      callback(success ? null : error)
    })
  }

  async getProfile(): Promise<User | null> {
    const userProfileResult = await this.httpClient.get<User>('/user/profile')
    if (!userProfileResult.ok) {
      throw new Error(userProfileResult.err.type)
    }
    return userProfileResult.value
  }

  async login(username: string, password: string): Promise<void> {
    const accessTokenResult = await this.httpClient.post<string>('/auth/login', { username, password })
    if (!accessTokenResult.ok) {
      throw new Error(accessTokenResult.err.type)
    }
    this.httpClient.setToken(accessTokenResult.value)
  }

  async restoreSession(): Promise<void> {
    const refreshTokenResult = await this.httpClient.get<string>('/auth/refresh')
    if (!refreshTokenResult.ok) {
      this.httpClient.setToken('')
      throw new Error(refreshTokenResult.err.type)
    }
    this.httpClient.setToken(refreshTokenResult.value)
  }

}