import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Global tokens and shared classes must be injected BEFORE any component
// stylesheet, otherwise a component overriding a shared class (.rule, .btn,
// .panel …) at equal specificity loses the cascade tie.
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
