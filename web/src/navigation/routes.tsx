import { Dashboard } from '@/modules/dashboard'
import { Home } from '@/modules/home/home-view'
import { Layout } from '@/modules/layout'
import { Login } from '@/modules/login'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthBase } from './components/AuthBase'
import { LoginBase } from './components/LoginBase'


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
        </Route>

      </Route>
      
    </Routes>
  </BrowserRouter>
  )
}