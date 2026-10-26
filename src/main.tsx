import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './personal.css'
import './site.css'
import { PromptsPage } from './PromptsPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PromptsPage />
  </StrictMode>,
)
