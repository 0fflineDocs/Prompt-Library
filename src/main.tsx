import React from 'react'
import ReactDOM from 'react-dom/client'
import PromptLibrary from './app'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PromptLibrary />
  </React.StrictMode>,
)
