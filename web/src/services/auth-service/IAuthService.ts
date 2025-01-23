

export interface IAuthService {

  login(username: string, password: string): Promise<AccessToken>
  getLoginData(): Promise<any>
}

type AccessToken = string