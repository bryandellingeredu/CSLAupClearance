import React from 'react'
import ReactDOM from 'react-dom/client'
import 'semantic-ui-css/semantic.min.css'
import './app/layout/styles.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router/Routes.tsx'
import { Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";

Providers.globalProvider = new Msal2Provider({
  clientId: import.meta.env.VITE_CLIENT_ID!,
  authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID}`,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
  scopes: ['user.read'],
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <RouterProvider router={router}/>
  </React.StrictMode>,
)
