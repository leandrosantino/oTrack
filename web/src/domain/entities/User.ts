export type SystemPermissionKeys = string[]

export type User = {
  id: string
  displayName: string
  email: string
  role: string,
  profilePictureUrl?: string
}