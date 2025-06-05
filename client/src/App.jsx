// App.jsx - Versione esplicita che mostra chiaramente l'uso di Outlet
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { VaporThemeProvider } from '@vapor/v3-components';
import { UserRoleProvider } from './context/UserRoleContext';

// Import statico solo per AppShell (necessario per il layout)
import AppShell from './components/AppShell';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy imports per le pagine principali
const Home = React.lazy(() => import('./pages/Home'));
const Customers = React.lazy(() => import('./pages/Customers'));
const Catalog = React.lazy(() => import('./pages/Catalog'));
const Quote = React.lazy(() => import('./pages/Quote'));
const Quotes = React.lazy(() => import('./pages/Quotes'));
const Migration = React.lazy(() => import('./pages/Migration'));

// Creazione di un'istanza di QueryClient
const queryClient = new QueryClient();

/**
 * @component LoadingFallback
 * @description Componente di fallback durante il caricamento dei chunk
 */
function LoadingFallback() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <LoadingSpinner />
      <span>Caricamento pagina...</span>
    </div>
  );
}

/**
 * @component LayoutWithShell
 * @description Componente layout che include l'AppShell e renderizza le route annidate attraverso Outlet.
 * Il Suspense wrappa l'Outlet per gestire il lazy loading delle route figlie.
 */
function LayoutWithShell() {
  return (
    <AppShell>
      {/* 
        Suspense wrappa Outlet per gestire il lazy loading.
        Quando l'utente naviga verso una route lazy:
        1. React Router attiva la route
        2. Il componente lazy inizia a caricare
        3. Suspense mostra LoadingFallback durante il caricamento
        4. Una volta caricato, il componente viene renderizzato tramite Outlet
      */}
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}

/**
 * @component App
 * @description Componente root dell'applicazione con lazy loading e code splitting.
 * 
 * Struttura del routing:
 * - Route principale con LayoutWithShell che contiene AppShell + Suspense + Outlet
 * - Route annidate che vengono renderizzate tramite Outlet con lazy loading
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VaporThemeProvider>
        <UserRoleProvider>
          <Router>
            <Routes>
              {/* 
                Route principale che definisce il layout.
                element={<LayoutWithShell />} significa che questo componente
                verrà renderizzato e conterrà un <Outlet /> per le route figlie.
              */}
              <Route element={<LayoutWithShell />}>
                {/* 
                  Route annidate - vengono renderizzate attraverso <Outlet /> 
                  nel componente LayoutWithShell. Essendo lazy, verranno caricate
                  solo quando l'utente naviga verso di esse.
                */}
                <Route path="/" element={<Home />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/quote" element={<Quote />} />
                <Route path="/quote/:id" element={<Quote />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/migration/:subscriptionId" element={<Migration />} />
              </Route>
            </Routes>
          </Router>
        </UserRoleProvider>
      </VaporThemeProvider>
    </QueryClientProvider>
  );
}

export default App;