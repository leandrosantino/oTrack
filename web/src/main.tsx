import '@/styles/global.css'
import { createRoot } from 'react-dom/client'
import { SidebarProvider } from './components/ui/sidebar'
import { AuthProvider } from './contexts/authContext'
import { AppRutes } from './navigation/app.routes'


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <SidebarProvider>
      <AppRutes />
    </SidebarProvider>
  </AuthProvider>
)
