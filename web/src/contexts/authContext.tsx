import { User } from '@/domain/entities/User'
import { type ReactNode, createContext, useContext, useState } from 'react'

type AuthContextProps = {
  user: User | null
  setUser(user: User): void
  isAuth(): boolean
}

export const AuthContext = createContext({} as AuthContextProps)
const { Provider } = AuthContext

export function AuthProvider ({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  function isAuth () {
    return user !== null
  }

  return (
    <Provider value={{
      isAuth,
      user,
      setUser
    }}>
      {children}
    </Provider>
  )
}

export function useAuth () {
  return useContext(AuthContext)
}