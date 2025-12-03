import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Simple startup - no MSW needed, using local mock API
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
