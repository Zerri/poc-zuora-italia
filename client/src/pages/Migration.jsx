// Versione aggiornata di Migration.jsx che utilizza MigrationProductList
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  VaporPage,
  Typography,
  Button,
  Box,
  Grid,
  IconButton,
  ExtendedTabs,
  ExtendedTab,
  VaporToolbar,
  Card,
  CardContent,
  Divider,
  Tag,
  Title,
  VaporIcon,
  Snackbar,
  Alert
} from "@vapor/v3-components";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons/faArrowLeft";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons/faEllipsisVertical";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faFloppyDisk } from "@fortawesome/pro-regular-svg-icons/faFloppyDisk";
import { faPaperPlane } from "@fortawesome/pro-regular-svg-icons/faPaperPlane";
import { faCloudArrowUp } from "@fortawesome/pro-regular-svg-icons/faCloudArrowUp";
import { faServer } from "@fortawesome/pro-regular-svg-icons/faServer";

// Importiamo i nuovi componenti
import MigrationProductList from '../components/Migration/MigrationProductList';
import MigrationPathSelector from '../components/Migration/MigrationPathSelector';

// Importiamo i dati di test da un file esterno
// import MOCK_DATA from '../data/migrationMockData';
import MOCK_DATA from '../data/migrationMockDataFromQuote';

/**
* @component Migration
* @description Componente per la gestione della migrazione da una subscription esistente a un nuovo preventivo
* con supporto per diversi percorsi di migrazione (SaaS/IaaS)
*/
function Migration() {
  const { subscriptionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Stati per il componente
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Stato per i dati della migrazione (inizializzato con i dati simulati)
  const [migrationData, setMigrationData] = useState(MOCK_DATA);
  // Stato per il percorso di migrazione selezionato
  const [selectedPath, setSelectedPath] = useState(null);
  // Stato per i prodotti target attualmente selezionati
  const [targetProducts, setTargetProducts] = useState([]);

  // Effect per aggiornare i prodotti target quando viene selezionato un percorso di migrazione
  useEffect(() => {
    if (selectedPath && migrationData.migrationPaths[selectedPath]) {
      setTargetProducts(migrationData.migrationPaths[selectedPath].products);
    } else {
      setTargetProducts([]);
    }
  }, [selectedPath, migrationData]);

  // Simuliamo una query di caricamento per 1 secondo per vedere l'effetto di loading
  const { isLoading, error } = useQuery({
    queryKey: ['migration-mock', subscriptionId],
    queryFn: async () => {
      // Simuliamo un ritardo di caricamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      return MOCK_DATA;
    },
    enabled: false, // Disabilitiamo la query automatica, useremo i dati mock direttamente
  });

  // Mutation simulata per il salvataggio
  const saveMigrationMutation = {
    mutate: () => {
      // Simuliamo un ritardo di 1 secondo
      setTimeout(() => {
        setSnackbar({
          open: true,
          message: 'Migrazione completata con successo (simulazione)',
          severity: 'success'
        });
        
        // Simulazione del reindirizzamento
        setTimeout(() => {
          navigate('/quotes');
        }, 1500);
      }, 1000);
    },
    isPending: false
  };

  // Gestione cambio tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Funzione per selezionare un percorso di migrazione
  const handlePathSelect = (pathId) => {
    setSelectedPath(pathId);
  };

  // Funzione per rimuovere un prodotto dalla migrazione
  const handleRemoveProduct = (productId) => {
    setTargetProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Funzione per formattare i prezzi
  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // Funzione per calcolare il totale di listino dei prodotti sorgente
  const calculateCurrentTotal = () => {
    return migrationData.sourceProducts.reduce((total, product) => {
      return total + (product.price * (product.quantity || 1));
    }, 0);
  };

  // Funzione per calcolare il totale cliente dei prodotti sorgente (con sconti)
  const calculateCurrentCustomerTotal = () => {
    return migrationData.sourceProducts.reduce((total, product) => {
      const effectivePrice = product.customerPrice || product.price;
      return total + (effectivePrice * (product.quantity || 1));
    }, 0);
  };

  // Funzione per calcolare il totale di listino dei prodotti target
  const calculateNewTotal = () => {
    return targetProducts.reduce((total, product) => {
      return total + (product.price * (product.quantity || 1));
    }, 0);
  };

  // Funzione per calcolare il totale cliente dei prodotti target (con sconti)
  const calculateNewCustomerTotal = () => {
    return targetProducts.reduce((total, product) => {
      const effectivePrice = product.customerPrice || product.price;
      return total + (effectivePrice * (product.quantity || 1));
    }, 0);
  };

  // Funzione per salvare la migrazione
  const handleSaveMigration = () => {
    saveMigrationMutation.mutate({
      customerId: migrationData.customer.id,
      sourceProducts: migrationData.sourceProducts,
      targetProducts: targetProducts,
      migrationPath: selectedPath
    });
  };

  // Funzione per tornare alla pagina precedente
  const handleGoBack = () => {
    navigate('/customers');
  };

  // Funzione per tradurre le categorie
  const translateCategory = (category) => {
    const categories = {
      'enterprise': 'Enterprise',
      'professional': 'Professional',
      'hr': 'HR',
      'cross': 'Cross'
    };
    return categories[category] || category || 'N/A';
  };
  
  // Funzione per determinare il tipo di tag in base alla categoria
  const getCategoryTagType = (category) => {
    const categoryMap = {
      'enterprise': 'tone1',
      'professional': 'tone3',
      'hr': 'tone5',
      'cross': 'tone7'
    };
    return categoryMap[category] || 'tone1';
  };

  // Creiamo una mappa per identificare quali prodotti sostituiscono quali
  const createReplacementMap = () => {
    const replacementMap = {};
    
    if (selectedPath && migrationData.migrationPaths[selectedPath]) {
      migrationData.migrationPaths[selectedPath].products.forEach(product => {
        if (product.replacesProductId) {
          replacementMap[product.replacesProductId] = product.id;
        }
      });
    }
    
    return replacementMap;
  };

  // Simulazione dello stato di caricamento (1 secondo)
  const [loadingSimulation, setLoadingSimulation] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingSimulation(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Rendering iniziale durante il caricamento simulato
  if (loadingSimulation) {
    return (
      <VaporPage>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Typography>Caricamento dati migrazione in corso...</Typography>
        </Box>
      </VaporPage>
    );
  }

  // Otteniamo la mappa dei prodotti sostitutivi
  const replacementMap = createReplacementMap();

  return (
    <VaporPage>
      <Title
        leftItems={[
          <IconButton color="primary" size="small" onClick={handleGoBack}>
            <VaporIcon icon={faArrowLeft} size="xl" />
          </IconButton>
        ]}
        rightItems={[
          <Button 
            key="add-article" 
            size="small" 
            variant="contained" 
            startIcon={<VaporIcon icon={faPlus} />}
            onClick={() => navigate(`/catalog?migrationId=${subscriptionId || 'mock'}`)}
            disabled={!selectedPath}
          >
            Aggiungi articolo
          </Button>,
          <Button 
            key="save-migration" 
            size="small" 
            variant="outlined" 
            startIcon={<VaporIcon icon={faFloppyDisk} />}
            onClick={handleSaveMigration}
            disabled={saveMigrationMutation.isPending || !selectedPath}
          >
            {saveMigrationMutation.isPending ? 'Salvataggio...' : 'Completa Migrazione'}
          </Button>,
          <IconButton key="options" size="small">
            <VaporIcon icon={faEllipsisVertical} size="xl" />
          </IconButton>
        ]}
        size="small"
        title={`Migrazione per ${migrationData.customer.name}`}
      />

      <VaporPage.Section>
        <ExtendedTabs value={activeTab} onChange={handleTabChange} size="small" variant="standard">
          <ExtendedTab label="Migrazione" />
          <ExtendedTab label="Cliente" />
          <ExtendedTab label="Documenti" />
        </ExtendedTabs>

        {activeTab === 0 && (
          <Box sx={{ mt: 3 }}>
            {/* Riepilogo migrazione (mostrato solo se un percorso è selezionato) */}
            <Box sx={{ 
              mb: 2,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1
            }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Riepilogo Migrazione
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Valore di listino attuale:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatPrice(calculateCurrentTotal())} / anno
                  </Typography>
                  {calculateCurrentCustomerTotal() < calculateCurrentTotal() && (
                    <Typography variant="body2" color="success.main">
                      {formatPrice(calculateCurrentCustomerTotal())} con sconti
                    </Typography>
                  )}
                </Grid>
                
                {selectedPath && (
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Nuovo valore di listino:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatPrice(calculateNewTotal())} / anno
                    </Typography>
                    {calculateNewCustomerTotal() < calculateNewTotal() && (
                      <Typography variant="body2" color="success.main">
                        {formatPrice(calculateNewCustomerTotal())} con sconti
                      </Typography>
                    )}
                  </Grid>
                )}
                
                {selectedPath && (
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Differenza (con sconti):
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold" 
                      color={(calculateNewCustomerTotal() - calculateCurrentCustomerTotal()) >= 0 ? 'error.main' : 'success.main'}
                    >
                      {formatPrice(calculateNewCustomerTotal() - calculateCurrentCustomerTotal())} / anno
                      {' '}
                      ({((calculateNewCustomerTotal() - calculateCurrentCustomerTotal()) / calculateCurrentCustomerTotal() * 100).toFixed(1)}%)
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Struttura a due colonne per i prodotti */}
            <Grid container spacing={3}>
              {/* Colonna sinistra: prodotti originali */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1,
                  boxShadow: 1
                }}>
                  {/* Utilizziamo il nuovo componente MigrationProductList */}
                  <MigrationProductList 
                    products={migrationData.sourceProducts}
                    isMigrationSource={true}
                    nonMigrableProductIds={migrationData.nonMigrableProductIds}
                    nonMigrableReasons={migrationData.nonMigrableReasons}
                    replacementMap={replacementMap}
                    translateCategory={translateCategory}
                    getCategoryTagType={getCategoryTagType}
                    title="Prodotti Attuali"
                  />
                </Box>
              </Grid>
              
              {/* Colonna destra: percorsi di migrazione o prodotti proposti */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1,
                  boxShadow: 1
                }}>
                  {!selectedPath ? (
                    <MigrationPathSelector 
                      paths={migrationData.migrationPaths}
                      onSelectPath={handlePathSelect}
                      currentValue={calculateCurrentTotal()}
                    />
                  ) : (
                    <>
                      {/* Mostra l'intestazione del percorso selezionato */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2, 
                        backgroundColor: 'secondary.light',
                        borderRadius: 1,
                        mb: 3
                      }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: 'primary.main',
                          color: 'white',
                          mr: 2
                        }}>
                          <VaporIcon 
                            icon={selectedPath === 'saas' ? faCloudArrowUp : faServer} 
                            size="sm" 
                          />
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Percorso di migrazione: {migrationData.migrationPaths[selectedPath].title}
                          </Typography>
                          <Typography variant="body2">
                            {migrationData.migrationPaths[selectedPath].description}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ textAlign: 'right', mr: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Costo stimato:
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {formatPrice(migrationData.migrationPaths[selectedPath].totalValue)}/anno
                            </Typography>
                          </Box>
                          
                          <Button 
                            variant="outlined"
                            color="inherit"
                            size="small"
                            onClick={() => setSelectedPath(null)}
                          >
                            Cambia
                          </Button>
                        </Box>
                      </Box>
                      
                      {/* Utilizziamo il nuovo componente MigrationProductList per i prodotti target */}
                      <MigrationProductList 
                        products={targetProducts}
                        onRemoveProduct={handleRemoveProduct}
                        onAddProduct={() => navigate(`/catalog?migrationId=${subscriptionId || 'mock'}`)}
                        translateCategory={translateCategory}
                        getCategoryTagType={getCategoryTagType}
                        title="Nuovi Prodotti"
                      />
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Cliente */}
        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
              Informazioni cliente
            </Typography>
            
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Nome cliente
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {migrationData.customer.name}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Settore
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {migrationData.customer.sector}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {migrationData.customer.email}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        
        {/* Tab Documenti */}
        {activeTab === 2 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
              Documenti associati
            </Typography>
            
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Questa sezione conterrà i documenti associati alla migrazione, 
                come le specifiche tecniche, le condizioni contrattuali e altri allegati pertinenti.
              </Typography>
              
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                border: '1px dashed', 
                borderColor: 'divider',
                borderRadius: 1,
                textAlign: 'center'
              }}>
                <Typography variant="body2" color="text.secondary">
                  Nessun documento associato al momento.
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 1 }}
                  startIcon={<VaporIcon icon={faPlus} />}
                >
                  Aggiungi Documento
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </VaporPage.Section>

      {/* Snackbar per notifiche */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({...snackbar, open: false})}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </VaporPage>
  );
}

export default Migration;