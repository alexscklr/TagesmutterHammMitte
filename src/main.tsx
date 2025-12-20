import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './features/auth/context/index'
import { EditModeProvider } from './features/admin/context/EditModeProvider.tsx'

const isDevelopment = import.meta.env.MODE === 'development';

createRoot(document.getElementById('root')!).render(
  isDevelopment ? (
    <StrictMode>
      <AuthProvider>
        <EditModeProvider>
          <App />
        </EditModeProvider>
      </AuthProvider>
    </StrictMode>
  ) : (
    <AuthProvider>
      <EditModeProvider>
        <App />
      </EditModeProvider>
    </AuthProvider>
  ),
)
