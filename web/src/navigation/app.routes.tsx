import { Dashboard, Layout, Login } from '@/factory'
import { Home } from '@/presentation/home/home-view'
import { BrowserRouter, Route, Routes } from 'react-router'
import { LoginOutLet } from './components/login-outlet'
import { RequireAuth } from './components/require-auth'


export function AppRutes(){
  return (
    <BrowserRouter>
    <Routes  >
      
      <Route element={<LoginOutLet/>} >
        <Route path='signIn' element={<Login/>} />
      </Route>

      <Route Component={Layout} >
        
        <Route element={<RequireAuth />}>
          <Route index element={<Home />} />
          <Route path='unauthorized' element={<h1>não autorizado</h1>}/>
        </Route>

        <Route element={<RequireAuth />}>
          <Route path='dash' element={<Dashboard />} />

        </Route>

      </Route>
      
    </Routes>
  </BrowserRouter>
  )
}