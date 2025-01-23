import '@/styles/global.css'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/authContext'
import { AppRutes } from './navigation/app.routes'


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AppRutes />
  </AuthProvider>
)
