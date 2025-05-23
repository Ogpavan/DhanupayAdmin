import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WalletProvider } from './context/WalletContext.jsx'
import { PermissionsProvider } from './context/PermissionsContext.jsx'

createRoot(document.getElementById('root')).render(
   <WalletProvider>
    <PermissionsProvider>

    <App />
    </PermissionsProvider>
  </WalletProvider>
)
