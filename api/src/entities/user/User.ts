import { Roules } from "entities/user/Roule"
import { UserToken } from "./UserToken"

export interface User {
  id: number,
  username: string
  password: string
  displayName: string
  roule: Roules,
  tokens: UserToken[]
}
