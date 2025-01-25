import { User } from "@/domain/entities/User"


export interface IAuthService {
  login(username: string, password: string): Promise<User | null>
}
