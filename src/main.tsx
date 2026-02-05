import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.scss';
import App from './app';
import './i18n/i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App
      apiProviders={{
        login: async (data) => console.log(data),
        register: async (data) => console.log(data),
      }}
    />
  </StrictMode>
);
