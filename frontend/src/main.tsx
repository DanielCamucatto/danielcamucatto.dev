import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import analytics from './services/analytics'

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
console.log('[main.tsx] VITE_GA_MEASUREMENT_ID:', measurementId)
if (measurementId) {
  analytics.initGA(measurementId)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
