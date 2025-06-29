import { Role } from "./Role"

export interface User {
  id: number,
  email: string
  password: string
  displayName: string
  profilePictureUrl?: string
  emailIsVerified: boolean
  role: Role
}
