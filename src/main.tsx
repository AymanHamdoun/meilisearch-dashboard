import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './assets/scss/app.scss';

import App from './components/App';
import { setupMocks } from "./mocks";
import { AuthProvider } from "./contexts/AuthContext";
import './i18n';

setupMocks();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
