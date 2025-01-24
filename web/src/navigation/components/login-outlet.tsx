import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router'


export function LoginOutLet () {
  const { isAuth } = useAuth()

  const location = useLocation()

  return (
    <>{
      !isAuth
        ? <Outlet />
        : <Navigate to='/' state={{ from: location }} replace />
    }</>
  )
}