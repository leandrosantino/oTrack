import { Navigate, Outlet, useLocation } from 'react-router'

interface RequiredPermissionProps {
  permission?: string
}

export function RequireAuth ({ permission }: RequiredPermissionProps) {
  const { isAuth } = {
    isAuth: false,
  }
  const location = useLocation()

  return (
    <>{
      isAuth
        ? (!permission
            ? <Outlet />
            : false
              ? <Outlet />
              : <Navigate to='/unauthorized' state={{ from: location }} replace />)
        : <Navigate to='/signin' state={{ from: location }} replace />
    }</>
  )
}
