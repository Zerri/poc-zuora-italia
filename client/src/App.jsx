// App.jsx - Componente principale con configurazione di routing e provider
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { VaporThemeProvider } from '@vapor/v3-components';
import AppShell from './components/AppShell';
import Home from './pages/Home';
import Customers from  './pages/Customers';

// Creazione di un'istanza di QueryClient
const queryClient = new QueryClient();

/**
 * @component LayoutWithShell
 * @description Componente layout che include l'AppShell e renderizza le route annidate attraverso Outlet
 */
function LayoutWithShell() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

/**
 * @component App
 * @description Componente root dell'applicazione che configura i provider
 * e il routing principale con layout condiviso.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VaporThemeProvider>
        <Router>
          <Routes>
            {/* Route principale con layout */}
            <Route element={<LayoutWithShell />}>
              {/* Route annidate che condividono lo stesso layout */}
              <Route path="/" element={<Home />} />
              <Route path="/customers" element={<Customers />} />
              {/* Aggiungi altre route qui, tutte utilizzeranno automaticamente AppShell */}
            </Route>
          </Routes>
        </Router>
      </VaporThemeProvider>
    </QueryClientProvider>
  );
}

export default App;