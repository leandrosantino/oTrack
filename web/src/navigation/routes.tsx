import { Dashboard } from '@/modules/dashboard'
import { Home } from '@/modules/home'
import { Layout } from '@/modules/layout'
import { Login } from '@/modules/login'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthBase } from './components/AuthBase'
import { LoginBase } from './components/LoginBase'
import { ServiceOrders } from '@/modules/service-orders'


export function AppRoutes(){

  return (
    <BrowserRouter>
    <Routes  >
      
      <Route Component={LoginBase} >
        <Route path='login' Component={ Login } />
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