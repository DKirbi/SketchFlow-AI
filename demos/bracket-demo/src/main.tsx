import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { bootEmbeddedLofiTheme } from 'lofi-kit';
import 'lofi-kit';
import './lofi-theme.css';
import './index.css';
import App from './App.tsx';

bootEmbeddedLofiTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
