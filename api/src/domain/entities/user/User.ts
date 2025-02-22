import { Roules } from "./Roule"


export interface User {
  id: number,
  username: string
  password: string
  displayName: string
  roule: Roules
}
