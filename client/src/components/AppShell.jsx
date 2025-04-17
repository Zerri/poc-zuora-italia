// AppShell.jsx
import React from 'react';
import { 
  VaporUIShellNav, 
  VaporAppBar, 
  IconButton, 
  VaporIcon, 
  useMediaQuery, 
  useTheme 
} from "@vapor/v3-components";
import { faGrid } from "@fortawesome/pro-regular-svg-icons/faGrid";

/**
 * @component AppShell
 * @description Componente che implementa la shell di navigazione.
 * Gestisce il drawer di navigazione e la barra delle applicazioni.
 * 
 * @param {Object} props - Le proprietà del componente
 * @param {React.ReactNode} props.children - Il contenuto da visualizzare all'interno della shell
 */
function AppShell({ children }) {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme["breakpoints"].up("lg"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Gestione automatica del drawer in base alle dimensioni dello schermo
  React.useEffect(() => {
    if (isLarge && !drawerOpen) {
      setDrawerOpen(true);
    }
    if (!isLarge && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isLarge]);

  // Funzione per alternare manualmente lo stato del drawer
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
              <IconButton size="small" color="secondary" icon="fa-magnifying-glass">
                <VaporIcon icon={faGrid} color="white" size="xxl" />
              </IconButton>
            </>
          }
        />
      }
      menuLevels={{
        children: [
          {
            label: "Home",
            icon: "fa-house",
            onClickFunction: () => {
              console.log("Welcome Home!");
            },
            badgeProps: {
              variant: "dot"
            }
          },
          {
            label: "Sales",
            icon: "fa-briefcase",
            children: [
              {
                label: "Invoicing",
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
                label: "Customers",
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
            label: "Purchase",
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
                closePopoverAfterClick: true
              }
            ]
          }
        ]
      }}
    >
      {children}
    </VaporUIShellNav>
  );
}

export default AppShell;