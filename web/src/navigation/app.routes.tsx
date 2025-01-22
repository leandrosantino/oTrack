import { Home } from '@/presentation/home/home-view'
import { Layout } from '@/presentation/layout/layout-view'
import { BrowserRouter, Route, Routes } from 'react-router'
import { LoginOutLet } from './login-outlet'
import { RequireAuth } from './require-auth'


export function AppRutes(){
  return (
    <BrowserRouter>
    <Routes  >
      <Route path='signIn' element={<LoginOutLet/>} />

      <Route Component={Layout} >

        <Route element={<RequireAuth />}>
          <Route index element={<Home />} />
          <Route path='unauthorized' element={<h1>não autorizado</h1>}/>
        </Route>
        
        <Route element={<RequireAuth permission='sf' />}>
        </Route>

      </Route>
      
    </Routes>
  </BrowserRouter>
  )
}