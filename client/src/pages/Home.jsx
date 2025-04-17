// HomePage.jsx
import React from 'react';
import VaporPage from "@vapor/v3-components/VaporPage";
import Typography from "@vapor/v3-components/Typography";
import { Button, VaporToolbar } from "@vapor/v3-components";
import { Link } from 'react-router-dom';

/**
 * @component HomePage
 * @description Componente che implementa il contenuto principale dell'applicazione.
 * Utilizza VaporPage per organizzare il contenuto con una toolbar e sezioni.
 */
function HomePage() {
  return (
    <VaporPage
      title="Pagina Principale"
      contentToolbar={
        <VaporToolbar
          variant="surface"
          size="large"
          contentLeft={[
            <Button variant="outlined">Azione Secondaria</Button>,
            <Button 
              variant="contained" 
              component={Link} 
              to="/customers"
            >
              Clienti
            </Button>
          ]}
        />
      }
    >
      <VaporPage.Section divider>
        <Typography variant="bodyInterfaceLargeExtended">
          Benvenuto nella pagina principale
        </Typography>
      </VaporPage.Section>
      <VaporPage.Section>
        <Typography variant="bodyInterfaceLargeExtended">
          Questa è la pagina principale dell'applicazione. Ora la struttura è modulare
          e l'AppShell viene definito una sola volta a livello di routing.
        </Typography>
      </VaporPage.Section>
    </VaporPage>
  );
}

export default HomePage;