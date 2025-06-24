import { User } from '@/domain/entities/User';
import { type IHttpClient } from '@/domain/providers/http-client/IHttpClient';
import { service } from '@/lib/@service';
import { inject } from 'tsyringe';
import { IAuthService } from "./IAuthService";

@service()
export class AuthService implements IAuthService {

  constructor(
    @inject('HttpClient') private readonly httpClient: IHttpClient
  ) {
    this.setAuthErrorInterceptor()
  }

  onExpiresToken: VoidFunction = () => { }

  setOnExpiresToken(callback: VoidFunction) {
    this.onExpiresToken = callback
  }

  async logout(): Promise<void> {
    await this.httpClient.post('/auth/logout', {})
  }

  setAuthErrorInterceptor() {
    this.httpClient.setErrorInterceptor(async (err, config) => {
      if (
        !config.url.includes('refresh') &&
        err.code === 401 &&
        err.type === 'EXPIRED_TOKEN'
      ) {
        try {
          console.log('refreshToken')
          await this.refreshToken()
          return await this.httpClient.call(config)
        } catch (err) {
          this.onExpiresToken()
          return null
        }
      }
      return null
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
    const accessTokenResult = await this.httpClient.post<{ accessToken: string }>('/auth/login', { username, password })
    if (!accessTokenResult.ok) {
      throw new Error(accessTokenResult.err.type)
    }
    this.httpClient.setToken(accessTokenResult.value.accessToken)
  }

  async refreshToken(): Promise<void> {
    const refreshTokenResult = await this.httpClient.get<{ accessToken: string }>('/auth/refresh')
    if (!refreshTokenResult.ok) {
      this.httpClient.setToken('')
      throw new Error(refreshTokenResult.err.message)
    }
    this.httpClient.setToken(refreshTokenResult.value.accessToken)
  }

  async generateWebSocketTicket() {
    const webSocketTicketResult = await this.httpClient.get<{ ticket: string }>('/auth/websocket-ticket')
    if (!webSocketTicketResult.ok) {
      throw new Error(webSocketTicketResult.err.message)
    }
    return webSocketTicketResult.value.ticket
  }

  async requestRecoiverPasswordEmail(email: string): Promise<void> {
    const result = await this.httpClient.post('/auth/recover-password', { email })
    if (!result.ok) {
      throw new Error(result.err.type)
    }
  }

  async recoiverPasswordTicketIsValid(ticket: string): Promise<boolean> {
    const result = await this.httpClient.post<{ isValid: boolean }>('/auth/recover-password/isValid', { ticket })
    if (!result.ok) {
      throw new Error(result.err.type)
    }
    return result.value.isValid
  }

  async updatePassword(ticket: string, newPassword: string): Promise<void> {
    const result = await this.httpClient.post('/auth/update-password', { newPassword, ticket })
    if (!result.ok) {
      throw new Error(result.err.type)
    }
  }


}