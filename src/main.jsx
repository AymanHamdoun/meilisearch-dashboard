import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './assets/scss/app.scss'

import App from './components/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
