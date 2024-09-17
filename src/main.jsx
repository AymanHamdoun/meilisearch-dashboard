import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './assets/scss/app.scss'

import App from './components/App.jsx'
import {setupMocks} from "./mocks.js";
import {AuthProvider} from "./contexts/AuthContext.jsx";
import './i18n'; // Import the i18n configuration

setupMocks()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
        <App />
    </AuthProvider>
  </StrictMode>,
)
