import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import SmoothScroll from './components/SmoothScroll.tsx';
import CursorGlow from './components/CursorGlow.tsx';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <AuthProvider>
          <CurrencyProvider>
            {/* Lenis ultra-smooth scrolling — wraps entire app */}
            <SmoothScroll>
              {/* Cursor radial glow — desktop only, auto-hidden on touch */}
              <CursorGlow />
              <App />
            </SmoothScroll>
          </CurrencyProvider>
        </AuthProvider>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
);
