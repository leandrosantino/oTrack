import { User } from "@/domain/entities/User"


export interface IAuthService {
  login(username: string, password: string): Promise<void>
  logout(): Promise<void>
  getProfile(): Promise<User | null>
  refreshToken(): Promise<void>
  onExpiresToken(): void
  setOnExpiresToken(callback: VoidFunction): void
  generateWebSocketTicket(): Promise<string>
  requestRecoiverPasswordEmail(email: string): Promise<void>
  recoiverPasswordTicketIsValid(ticket: string): Promise<boolean>
  updatePassword(ticket: string, newPassword: string): Promise<void>
}
