import { Role } from "./Role"

export interface User {
  id: number,
  email: string
  password: string
  displayName: string
  profilePictureUrl?: string
  role: Role
}
