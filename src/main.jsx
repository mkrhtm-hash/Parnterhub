import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CookieProvider } from './context/CookieContext';
import { SiteDataProvider } from './context/SiteDataContext';
import { I18nProvider } from './i18n/I18nContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <I18nProvider>
            <ToastProvider>
              <CookieProvider>
                <SiteDataProvider>
                  <App />
                </SiteDataProvider>
              </CookieProvider>
            </ToastProvider>
          </I18nProvider>
        </ThemeProvider>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
);
