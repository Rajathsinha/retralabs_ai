import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
);
