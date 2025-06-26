import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Bootstrap the Rates & Inventory Management Platform
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Development logging
console.log('🚀 Rates & Inventory Platform - Frontend Started'); 