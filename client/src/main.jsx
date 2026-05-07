import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

const configuredApiBase = import.meta.env.VITE_API_BASE_URL || ''
axios.defaults.baseURL = configuredApiBase.replace(/\/$/, '')

axios.interceptors.request.use((config) => {
  const normalizedBase = String(config.baseURL || '').replace(/\/$/, '')
  const normalizedUrl = String(config.url || '')

  // Prevent duplicate /api when baseURL already includes it in production.
  if (normalizedBase.endsWith('/api') && normalizedUrl.startsWith('/api/')) {
    return {
      ...config,
      url: normalizedUrl.replace(/^\/api/, ''),
      baseURL: normalizedBase,
    }
  }

  return config
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
