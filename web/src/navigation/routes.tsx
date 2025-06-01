import Dashboard from '@/modules/dashboard/dashboard.controller'
import Home from '@/modules/home/home.controller'
import Layout from '@/modules/layout/layout.controller'
import Login from '@/modules/login/login.controller'
import RequestRecoverPassword from '@/modules/request-recover-password/request-recover-password.controller'
import ResetPassword from '@/modules/reset-password/reset-password.controller'
import ServiceOrders from '@/modules/service-orders/service-orders.controller'
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