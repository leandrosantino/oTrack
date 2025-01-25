import { useAuth } from "@/contexts/authContext"
import { Navigate, Outlet, useLocation } from "react-router"

export function LoginBase() {
  const {isAuth} = useAuth()
  const location = useLocation()

  if(isAuth()){
    return <Navigate {...{
      to: '/',
      state: { from: location },
      replace: true,
    }}/>
  }

  return <Outlet/>
}