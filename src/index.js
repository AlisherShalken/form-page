import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const rootElement = createRoot(root);
rootElement.render(app);