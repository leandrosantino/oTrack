import '@/styles/global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { AppRutes } from './navigation/app.routes'

const queryCLient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryCLient} >  
    <AppRutes />
  </QueryClientProvider>
)
