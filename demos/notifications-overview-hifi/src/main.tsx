import '@podium-design-system/react-components/pds-mantine-styles.css';
import { PodiumProvider } from '@podium-design-system/react-components';
import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <PodiumProvider>
      <MantineProvider>
        <App />
      </MantineProvider>
    </PodiumProvider>
  </StrictMode>,
);
