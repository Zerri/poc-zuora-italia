// CustomersPage.jsx
import React from 'react';
import VaporPage from "@vapor/v3-components/VaporPage";
import Typography from "@vapor/v3-components/Typography";
import { Button, VaporToolbar } from "@vapor/v3-components";
import { Link } from 'react-router-dom';

/**
 * @component CustomersPage
 * @description Esempio di una seconda pagina che utilizzerà lo stesso AppShell
 */
function CustomersPage() {
  return (
    <VaporPage
      title="Seconda Pagina"
      contentToolbar={
        <VaporToolbar
          variant="surface"
          size="large"
          contentLeft={[
            <Button 
              variant="contained" 
              component={Link} 
              to="/"
            >
              Torna alla Home
            </Button>
          ]}
        />
      }
    >
      <VaporPage.Section divider>
        <Typography variant="bodyInterfaceLargeExtended">
          Benvenuto nella seconda pagina
        </Typography>
      </VaporPage.Section>
      <VaporPage.Section>
        <Typography variant="bodyInterfaceLargeExtended">
          Questa pagina utilizza lo stesso AppShell della pagina principale, 
          ma ha un contenuto diverso. L'AppShell viene definito una sola volta 
          nel componente di layout condiviso.
        </Typography>
      </VaporPage.Section>
      <VaporPage.Section>
        <Typography variant="bodyInterfaceLargeExtended">
          Per aggiungere altre pagine alla tua applicazione, basta creare nuovi componenti
          e aggiungerli al sistema di routing in App.jsx. Ogni nuova pagina utilizzerà
          automaticamente la stessa shell di navigazione.
        </Typography>
      </VaporPage.Section>
    </VaporPage>
  );
}

export default CustomersPage;