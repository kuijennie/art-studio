import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'
import { router } from './router'
import './styles/globals.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_YOUR_KEY_HERE') {
  console.warn(
    '[LALAPJ] Add your Clerk publishable key to .env.local:\n  VITE_CLERK_PUBLISHABLE_KEY=pk_test_...'
  )
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY ?? 'pk_test_placeholder'}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
)
