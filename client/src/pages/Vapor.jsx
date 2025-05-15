import React from 'react';
import VaporPage from "@vapor/v3-components/VaporPage";
import Typography from "@vapor/v3-components/Typography";
import { Button, IconButton, VaporToolbar, VaporAppBar, VaporUIShellNav, VaporIcon, useMediaQuery, useTheme} from "@vapor/v3-components";
import { faGrid } from "@fortawesome/pro-regular-svg-icons/faGrid";

/**
 * @component Vapor
 * @description Componente principale che implementa un'interfaccia utente con la navigazione laterale di Vapor UI.
 * Questo componente utilizza VaporUIShellNav per creare un layout con menu di navigazione a più livelli
 * e una barra delle applicazioni reattiva che si adatta alle dimensioni dello schermo.
 * 
 * Il componente gestisce automaticamente l'apertura e la chiusura del drawer di navigazione
 * in base alle dimensioni dello schermo (aperto su schermi grandi, chiuso su schermi piccoli).
 */
function Vapor() {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme["breakpoints"].up("lg"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  /**
   * Gestisce l'apertura/chiusura automatica del drawer di navigazione in base alle dimensioni dello schermo.
   * - Su schermi grandi (lg e superiori): il drawer rimane aperto
   * - Su schermi piccoli: il drawer rimane chiuso
   */
  React.useEffect(() => {
    if (isLarge && !drawerOpen) {
      setDrawerOpen(true);
    }
    if (!isLarge && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isLarge]);

  /**
   * Funzione per alternare manualmente lo stato del drawer di navigazione
   */
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };


  return (
    <VaporUIShellNav
      drawerOpen={drawerOpen}
      setDrawerOpen={setDrawerOpen}
      renderToolbar={
        <VaporAppBar
          isDrawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
          rightContent={
            <>
              {/* Pulsante icona nella barra delle applicazioni */}
              <IconButton size="small" color="secondary">
                <VaporIcon icon={faGrid} color="white" size="xxl" />
              </IconButton>
            </>
          }
        />
      }
      menuLevels={{
        children: [
          {
            label: "Home", // Voce principale Home
            icon: "fa-house",
            onClickFunction: () => {
              console.log("Welcome Home!");
            },
            badgeProps: {
              variant: "dot" // Badge a puntino per evidenziare la voce
            }
          },
          {
            label: "Sales", // Voce principale Sales con sottomenu
            icon: "fa-briefcase",
            children: [
              {
                label: "Invoicing", // Sottomenu per la fatturazione
                children: [
                  {
                    label: "Invoices",
                    onClickFunction: () => {}
                  },
                  {
                    label: "Reminders",
                    onClickFunction: () => {}
                  },
                  {
                    label: "Subscriptions",
                    onClickFunction: () => {}
                  }
                ]
              },
              {
                label: "Customers", // Sottomenu per i clienti
                children: [
                  {
                    label: "Customers",
                    onClickFunction: () => {}
                  },
                  {
                    label: "Customer groups",
                    onClickFunction: () => {}
                  },
                  {
                    label: "Customer setup",
                    onClickFunction: () => {}
                  }
                ]
              },
              {
                label: "Packages",
                onClickFunction: () => {}
              },
              {
                label: "Shipments",
                onClickFunction: () => {}
              }
            ]
          },
          {
            label: "Purchase", // Voce principale Purchase con sottomenu
            icon: "fa-bag-shopping",
            children: [
              {
                label: "Vendors",
                onClickFunction: () => {}
              },
              {
                label: "Purchase orders",
                onClickFunction: () => {}
              },
              {
                label: "Purchase receives",
                onClickFunction: () => {}
              },
              {
                label: "Bills",
                onClickFunction: () => {},
                closePopoverAfterClick: true // Chiude il popover dopo il click
              }
            ]
          }
        ]
      }}
    >
      {/* 
       * Contenuto principale della pagina 
       * Utilizza VaporPage per organizzare il contenuto con una toolbar e sezioni
       */}
      <VaporPage
        title="Title"
        contentToolbar={
          <VaporToolbar
            variant="surface"
            size="large"
            contentLeft={[
              <Button variant="outlined">Secondary Left</Button>,
              <Button variant="contained">Primary Left</Button>
            ]}
          />
        }
      >
        {/* Prima sezione con divisore */}
        <VaporPage.Section divider>
          <Typography variant="bodyInterfaceLargeExtended">Section 1</Typography>
        </VaporPage.Section>
        {/* Seconda sezione */}
        <VaporPage.Section>
          <Typography variant="bodyInterfaceLargeExtended">Section 2</Typography>
        </VaporPage.Section>
      </VaporPage>
    </VaporUIShellNav>
  );
}

export default Vapor;