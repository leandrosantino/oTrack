import '@/styles/global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import Home from './App'

const queryCLient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryCLient} >  
    <Home/>
  </QueryClientProvider>
)
