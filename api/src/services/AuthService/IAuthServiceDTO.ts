import { Roule } from "entities/user/Roule"
import { User } from "entities/user/User"

export type AuthRequestDTO = {
  username: string
  password: string
}

export type JwtToken = string

export type TokenData = Pick<User, 'id' | 'displayName' | 'username' | 'roule'>
