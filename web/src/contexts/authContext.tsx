import { authService, httpClient } from '@/factory'
import { type ReactNode, createContext, useState } from 'react'

type SystemPermissionKeys = string[]

interface User {
  id: string
  name: string
  email: string
  permissions: SystemPermissionKeys[]
}

interface AuthContextProps {
  isAuth: boolean
  user: User | null
  signIn: (userName: string, password: string) => Promise<void>
  signOut: () => void
  verifyUserPermisson: (permission: SystemPermissionKeys) => boolean | undefined
}

export const AuthContext = createContext({} as AuthContextProps)
const { Provider } = AuthContext

export function AuthProvider ({ children }: { children: ReactNode }) {
  const [isAuth, setAuth] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  async function signIn (userName: string, password: string) {
    const accessToken = await authService.login(userName, password)
    if (accessToken) {
      httpClient.setToken(accessToken)

      const userInfo = await authService.getLoginData()

      setUser(userInfo)
      setAuth(true)
    }
  }

  function signOut () {
    setAuth(false)
    setUser(null)
    httpClient.setToken('')
  }

  function verifyUserPermisson (permission: SystemPermissionKeys) {
    return user?.permissions.includes(permission)
  }

  return (
    <Provider value={{
      isAuth,
      user,
      signIn,
      signOut,
      verifyUserPermisson
    }}>
      {children}
    </Provider>
  )
}
