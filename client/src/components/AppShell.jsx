// client/src/components/AppShell.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  VaporUIShellNav, 
  VaporAppBar, 
  IconButton, 
  VaporIcon, 
  useMediaQuery, 
  useTheme,
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Chip
} from "@vapor/v3-components";
import { faGrid } from "@fortawesome/pro-regular-svg-icons/faGrid";
import { faUserTag } from "@fortawesome/pro-regular-svg-icons/faUserTag";
// Importa il context
import { useUserRole } from '../context/UserRoleContext';

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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Usa il context per accedere e modificare il ruolo utente
  const { userRole, setUserRole } = useUserRole();

  // Gestione automatica del drawer in base alle dimensioni dello schermo
  React.useEffect(() => {
    if (isLarge && !drawerOpen) {
      setDrawerOpen(true);
    }
    if (!isLarge && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isLarge, drawerOpen]);

  // Funzione per alternare manualmente lo stato del drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  // Gestisce il cambio di ruolo utente
  const handleRoleChange = (event) => {
    setUserRole(event.target.value);
  };

  // Mappa delle etichette dei ruoli per la visualizzazione
  const roleLabels = {
    'admin': 'Admin',
    'sales': 'Sales',
    'touchpoint': 'Touchpoint'
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
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                <FormControl 
                  size="small"
                  variant="outlined"
                  sx={{ 
                    minWidth: 120,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': { 
                      
                      display: 'flex',
                      alignItems: 'center',
                      py: 1,
                      pl: 1
                    }
                  }}
                >
                  <Select
                    value={userRole}
                    onChange={handleRoleChange}
                    displayEmpty
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VaporIcon icon={faUserTag} size="lg" />
                        <Typography variant="body2">
                          {roleLabels[selected]}
                        </Typography>
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        sx: { mt: 1 }
                      }
                    }}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="sales">Sales</MenuItem>
                    <MenuItem value="touchpoint">Touchpoint</MenuItem>
                  </Select>
                </FormControl>
              </Box>
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
            label: "Dashboard",
            icon: "fa-gauge",
            onClickFunction: () => {
              navigate('/');
            }
          },
          {
            label: "Configuratore",
            icon: "fa-cog",
            onClickFunction: () => {
              navigate('/quote');
            }
          },
          {
            label: "Catalogo",
            icon: "fa-book",
            onClickFunction: () => {
              navigate('/catalog');
            }
          },
          {
            label: "Preventivi",
            icon: "fa-file-invoice",
            onClickFunction: () => {
              navigate('/quotes');
            }
          },
          {
            label: "Clienti",
            icon: "fa-user-tie",
            onClickFunction: () => {
              navigate('/customers');
            }
          },
          {
            label: "Report",
            icon: "fa-chart-simple",
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
            label: "Settings",
            icon: "fa-sliders",
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