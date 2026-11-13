import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import './styles/tokens.css';
import './styles/privacy.css';
import './styles/home.css';
import './styles/supporting.css';
import './styles/people-insights-contact.css';
const root = document.getElementById('root')!;
const app = <React.StrictMode><RouterProvider router={router}/></React.StrictMode>;
// Parameterized directory views are rendered afresh to avoid hydrating a
// default static listing with different client-side filter results.
if (root.dataset.prerenderPath === (window.location.pathname.replace(/\/+$/, '') || '/') && !window.location.search) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
