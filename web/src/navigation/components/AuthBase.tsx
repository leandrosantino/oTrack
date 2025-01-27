import { useAuth } from "@/contexts/authContext"
import { Navigate, Outlet, useLocation } from "react-router"

export function AuthBase ({ requiredRoule }: { requiredRoule?: string }) {
  const {user, isAuth} = useAuth()
  const location = useLocation()

  if(!isAuth()){
    return <Navigate { ...{
      to: '/login',
      state: { from: location },
      replace: true,
    } } />
  }
  
  if(requiredRoule && user?.roule != requiredRoule){
    return <Navigate { ...{
      to: '/unauthorized',
      state: { from: location },
      replace: true,
    } } />
  }

  return <Outlet />
}

