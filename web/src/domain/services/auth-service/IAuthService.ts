import { User } from "@/domain/entities/User"


export interface IAuthService {
  login(username: string, password: string): Promise<void>
  getProfile(): Promise<User | null>
  restoreSession(): Promise<void>
  onRefreshToken(callback: (error?: any) => void): void
}
