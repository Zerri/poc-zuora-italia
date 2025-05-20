// client/src/pages/Migration.jsx - Versione completa con percorsi di migrazione
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

// Importiamo i componenti per le liste di prodotti
import SourceProductList from '../components/Migration/SourceProductList';
import TargetProductList from '../components/Migration/TargetProductList';
// Importiamo il nuovo componente di selezione percorso
import MigrationPathSelector from '../components/Migration/MigrationPathSelector';

// DATI SIMULATI aggiornati con due percorsi di migrazione
const MOCK_DATA = {
  subscriptionId: "mock-subscription-123",
  customer: {
    name: "Acme Corporation",
    sector: "Manifatturiero",
    email: "info@acme.com",
    id: "customer-123"
  },
  sourceProducts: [
    {
      id: "prod-001",
      name: "TeamSystem Enterprise",
      description: "Soluzione ERP completa per aziende di medie e grandi dimensioni",
      category: "enterprise",
      price: 5000,
      quantity: 1,
      ratePlan: {
        id: "rp-001",
        name: "Enterprise Standard",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "charge-001",
          name: "Licenza Base",
          type: "Recurring",
          model: "FlatFee",
          value: 1,
          calculatedPrice: 5000
        }
      ]
    },
    {
      id: "prod-002",
      name: "TeamSystem CRM",
      description: "Gestione delle relazioni con i clienti integrata",
      category: "professional",
      price: 2500,
      quantity: 1,
      ratePlan: {
        id: "rp-002",
        name: "CRM Professional",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "charge-002",
          name: "Licenza CRM",
          type: "Recurring",
          model: "FlatFee",
          value: 1,
          calculatedPrice: 2500
        }
      ]
    },
    {
      id: "prod-003",
      name: "TeamSystem HR",
      description: "Gestione delle risorse umane",
      category: "hr",
      price: 3000,
      quantity: 1,
      ratePlan: {
        id: "rp-003",
        name: "HR Complete",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "charge-003",
          name: "Licenza HR",
          type: "Recurring",
          model: "FlatFee",
          value: 1,
          calculatedPrice: 3000
        }
      ]
    },
    {
      id: "prod-004",
      name: "TeamSystem Legacy Module",
      description: "Modulo legacy non più supportato",
      category: "cross",
      price: 1500,
      quantity: 1,
      ratePlan: {
        id: "rp-004",
        name: "Legacy Module",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "charge-004",
          name: "Licenza Legacy",
          type: "Recurring",
          model: "FlatFee",
          value: 1,
          calculatedPrice: 1500
        }
      ]
    }
  ],
  migrationPaths: {
    saas: {
      id: "saas",
      title: "Cloud SaaS",
      description: "Migrazione verso servizi cloud completamente gestiti",
      benefits: [
        "Nessuna gestione dell'infrastruttura",
        "Aggiornamenti automatici",
        "Scalabilità on-demand"
      ],
      totalValue: 11700,
      percentChange: "-2,5%", // Calcolato rispetto al totale corrente (12000)
      products: [
        {
          id: "prod-101",
          name: "TeamSystem Enterprise Cloud",
          description: "Nuova versione cloud della soluzione ERP completa",
          category: "enterprise",
          price: 5500,
          quantity: 1,
          ratePlan: {
            id: "rp-101",
            name: "Enterprise Cloud Premium",
            Infrastructure__c: "SAAS"
          },
          charges: [
            {
              id: "charge-101",
              name: "Licenza Base Cloud",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 5500
            }
          ],
          replacesProductId: "prod-001" 
        },
        {
          id: "prod-102",
          name: "TeamSystem CRM+",
          description: "Versione migliorata del CRM con nuove funzionalità",
          category: "professional",
          price: 3000,
          quantity: 1,
          ratePlan: {
            id: "rp-102",
            name: "CRM+ Premium",
            Infrastructure__c: "SAAS"
          },
          charges: [
            {
              id: "charge-102",
              name: "Licenza CRM+",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 3000
            }
          ],
          replacesProductId: "prod-002"
        },
        {
          id: "prod-103",
          name: "TeamSystem HR Cloud",
          description: "Gestione delle risorse umane basata su cloud",
          category: "hr",
          price: 3200,
          quantity: 1,
          ratePlan: {
            id: "rp-103",
            name: "HR Cloud Complete",
            Infrastructure__c: "SAAS"
          },
          charges: [
            {
              id: "charge-103",
              name: "Licenza HR Cloud",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 3200
            }
          ],
          replacesProductId: "prod-003"
        }
      ]
    },
    iaas: {
      id: "iaas",
      title: "Cloud IaaS",
      description: "Migrazione verso infrastruttura cloud self-managed",
      benefits: [
        "Maggiore controllo",
        "Personalizzazione avanzata",
        "Utilizzo dell'infrastruttura esistente"
      ],
      totalValue: 10800,
      percentChange: "-10%", // Calcolato rispetto al totale corrente (12000)
      products: [
        {
          id: "prod-201",
          name: "TeamSystem Enterprise IaaS",
          description: "Versione ERP ottimizzata per infrastruttura cloud",
          category: "enterprise",
          price: 4800,
          quantity: 1,
          ratePlan: {
            id: "rp-201",
            name: "Enterprise IaaS Standard",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-201",
              name: "Licenza Base IaaS",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 4800
            }
          ],
          replacesProductId: "prod-001"
        },
        {
          id: "prod-202",
          name: "TeamSystem CRM IaaS",
          description: "CRM con deployment su infrastruttura cloud",
          category: "professional",
          price: 2200,
          quantity: 1,
          ratePlan: {
            id: "rp-202",
            name: "CRM IaaS",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-202",
              name: "Licenza CRM IaaS",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 2200
            }
          ],
          replacesProductId: "prod-002"
        },
        {
          id: "prod-203",
          name: "TeamSystem HR IaaS",
          description: "Soluzione HR con deployment IaaS",
          category: "hr",
          price: 2600,
          quantity: 1,
          ratePlan: {
            id: "rp-203",
            name: "HR IaaS",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-203",
              name: "Licenza HR IaaS",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 2600
            }
          ],
          replacesProductId: "prod-003"
        },
        {
          id: "prod-204",
          name: "TeamSystem Migration Tool",
          description: "Strumento di migrazione dati per infrastruttura cloud",
          category: "cross",
          price: 1200,
          quantity: 1,
          ratePlan: {
            id: "rp-204",
            name: "Migration Tool",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-204",
              name: "Licenza Migration Tool",
              type: "OneTime",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 1200
            }
          ]
        }
      ]
    }
  },
  nonMigrableProductIds: ["prod-004"],
  nonMigrableReasons: {
    "prod-004": "Modulo legacy non supportato nelle nuove versioni"
  },
  summary: {
    currentValue: 12000, // 5000 + 2500 + 3000 + 1500
    saasValue: 11700,    // 5500 + 3000 + 3200
    iaasValue: 10800     // 4800 + 2200 + 2600 + 1200
  }
};

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

  // Funzione per calcolare il totale corrente (in base ai prodotti sorgente)
  const calculateCurrentTotal = () => {
    return migrationData.sourceProducts.reduce((total, product) => {
      return total + (product.price * (product.quantity || 1));
    }, 0);
  };

  // Funzione per calcolare il nuovo totale (in base ai prodotti target attuali)
  const calculateNewTotal = () => {
    return targetProducts.reduce((total, product) => {
      return total + (product.price * (product.quantity || 1));
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
            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
              Gestione Migrazione
            </Typography>
            
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
                  <SourceProductList 
                    products={migrationData.sourceProducts}
                    nonMigrableProductIds={migrationData.nonMigrableProductIds}
                    nonMigrableReasons={migrationData.nonMigrableReasons}
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
                      
                      {/* Mostra i prodotti target per il percorso selezionato */}
                      <TargetProductList 
                        products={targetProducts}
                        onRemoveProduct={handleRemoveProduct}
                        onNavigateToCatalog={() => navigate(`/catalog?migrationId=${subscriptionId || 'mock'}`)}
                      />
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
            
            {/* Riepilogo migrazione (mostrato solo se un percorso è selezionato) */}
            {selectedPath && (
              <Box sx={{ 
                mt: 4,
                p: 3,
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
                      Valore attuale:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatPrice(calculateCurrentTotal())} / anno
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Nuovo valore:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatPrice(calculateNewTotal())} / anno
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Differenza:
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold" 
                      color={(calculateNewTotal() - calculateCurrentTotal()) >= 0 ? 'error.main' : 'success.main'}
                    >
                      {formatPrice(calculateNewTotal() - calculateCurrentTotal())} / anno
                      {' '}
                      ({((calculateNewTotal() - calculateCurrentTotal()) / calculateCurrentTotal() * 100).toFixed(1)}%)
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
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