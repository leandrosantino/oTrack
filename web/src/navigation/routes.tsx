import { Dashboard } from '@/modules/dashboard'
import { Home } from '@/modules/home'
import { Layout } from '@/modules/layout'
import { Login } from '@/modules/login'
import { RequestRecoverPassword } from '@/modules/request-recover-password'
import { ResetPassword } from '@/modules/reset-password'
import { ServiceOrders } from '@/modules/service-orders'
import { AuthBase } from '@/navigation/components/AuthBase'
import { LoginBase } from '@/navigation/components/LoginBase'
import { BrowserRouter, Route, Routes } from 'react-router'


export function AppRoutes(){

  return (
    <BrowserRouter>
    <Routes  >
      
      <Route Component={LoginBase} >
        <Route path='login' Component={ Login } />
        <Route path='request-recover-password' Component={ RequestRecoverPassword } />
        <Route path='update-password/:ticket' Component={ ResetPassword } />
      </Route>
      
      <Route Component={ Layout } >
        
        <Route Component={AuthBase}>
          <Route index Component={ Home } />
          <Route path='unauthorized' element={<h1>não autorizado</h1>}/>
        </Route>

        <Route Component={AuthBase}>
          <Route path='dash' Component={ Dashboard } />
          <Route path='service-orders' Component={ ServiceOrders } />
        </Route>

      </Route>
      
    </Routes>
  </BrowserRouter>
  )
}