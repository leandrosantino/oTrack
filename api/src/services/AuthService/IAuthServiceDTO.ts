
export type AuthRequestDTO = {
  username: string
  password: string
}

export type JwtToken = string

export type TokenData = {
  uid: string
  username: string
  permissions: string[]
}
