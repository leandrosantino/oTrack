import { User } from "@/domain/entities/User"


export interface IAuthService {
  login(username: string, password: string): Promise<void>
  logout(): Promise<void>
  getProfile(): Promise<User | null>
  restoreSession(): Promise<void>
  onExpiresToken(callback: VoidFunction): void
}
