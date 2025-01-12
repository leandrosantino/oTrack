import { Roules } from "entities/user/Roule"

export interface User {
  id: number,
  username: string
  password: string
  displayName: string
  roule: Roules
}
