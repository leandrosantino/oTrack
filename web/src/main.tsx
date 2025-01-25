import 'reflect-metadata';

import '@/factory';
import '@/styles/global.css';
import { createRoot } from 'react-dom/client';
import { SidebarProvider } from './components/ui/sidebar';
import { AuthProvider } from './contexts/authContext';
import { AppRoutes } from './navigation/routes';


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <SidebarProvider>
      <AppRoutes />
    </SidebarProvider>
  </AuthProvider>
)
