import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  VaporPage,
  Typography,
  Button, 
  VaporToolbar, 
  CircularProgress, 
  Alert, 
  Card, 
  CardContent, 
  Tag, 
  Chip,
  Divider, 
  Grid, 
  Box,
  VaporIcon,
  Snackbar,
  DataGrid,
  ButtonGroup,
  IconButton,
  Tooltip
} from "@vapor/v3-components";
import { faCirclePlus } from "@fortawesome/pro-regular-svg-icons/faCirclePlus";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons/faArrowLeft";
import { faInfoCircle } from "@fortawesome/pro-regular-svg-icons/faInfoCircle";
import { faTableCells } from "@fortawesome/pro-regular-svg-icons/faTableCells";
import { faTableCellsLarge } from "@fortawesome/pro-regular-svg-icons/faTableCellsLarge";
import SearchBar from "@vapor/v3-components/SearchBar";
import { Link } from 'react-router-dom';
import ProductDrawer from '../components/ProductDrawerAlt';
// Importa l'hook per utilizzare il context del ruolo utente
import { useUserRole } from '../context/UserRoleContext';

/**
 * @component CatalogPage
 * @description Pagina che mostra il catalogo prodotti TeamSystem filtrato per permessi utente
 */
function CatalogPage() {
  // URL base del backend
  const API_URL = import.meta.env.VITE_API_URL || '/api';
  
  // Per la gestione delle query
  const queryClient = useQueryClient();
  
  // State per filtri ricerca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('tutti');
  
  // State per la vista (cards o griglia)
  const [viewMode, setViewMode] = useState('cards');
  
  // State per gestione drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // State per gestire i messaggi
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  // Per il recupero del quoteId
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quoteId = searchParams.get('quoteId');

  // Ottieni il ruolo utente dal context
  const { userRole } = useUserRole();
  
  // Forza aggiornamento componente
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Effetto per riaggiornare la vista quando cambia il ruolo utente
  useEffect(() => {
    // Incrementa il refreshKey per forzare un re-render
    setRefreshKey(prevKey => prevKey + 1);
    
    // Invalida manualmente la query dei prodotti
    queryClient.invalidateQueries({ queryKey: ['products', userRole] });
  }, [userRole, queryClient]);

  // Query per ottenere i prodotti, utilizzando userRole dal context
  const { 
    data: products = [], 
    isLoading, 
    error,
  } = useQuery({ 
    queryKey: ['products', userRole, refreshKey], // Aggiungi refreshKey alla query key
    queryFn: async () => {
      console.log(`Fetching products for user role: ${userRole}`); // Log per debug
      const response = await fetch(`${API_URL}/products1?userId=${userRole}`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 0, // Considera sempre i dati "stale" (vecchi)
    cacheTime: 0  // Non memorizzare i risultati nella cache
  });

  // Query per ottenere le categorie
  const { 
    data: categories = [], 
    isLoadingCategories 
  } = useQuery({ 
    queryKey: ['product-categories'], 
    queryFn: async () => {
      const response = await fetch(`${API_URL}/products/categories/all`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }
  });
  
  // Query per ottenere il preventivo attuale (se siamo in modalità preventivo)
  const {
    data: quoteData,
    isLoading: isLoadingQuote,
    error: quoteError
  } = useQuery({
    queryKey: ['quote', quoteId],
    queryFn: async () => {
      if (!quoteId) return null;
      const response = await fetch(`${API_URL}/quotes/${quoteId}`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!quoteId, // Esegui la query solo se c'è un quoteId
  });
  
  // Mutation per aggiungere un prodotto al preventivo
  const addToQuoteMutation = useMutation({
    mutationFn: async (productData) => {
      // Prepara i prodotti da inviare, considerando quelli esistenti
      const existingProducts = quoteData?.products || [];
      const updatedProducts = [...existingProducts, productData];
      
      const response = await fetch(`${API_URL}/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: updatedProducts
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalida la query per forzare un refresh dei dati del preventivo
      queryClient.invalidateQueries({ queryKey: ['quote', quoteId] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      // Mostra un messaggio di successo
      setSnackbar({
        open: true,
        message: 'Prodotto aggiunto al preventivo con successo',
        severity: 'success'
      });
      
      // Reindirizza dopo un breve ritardo per permettere all'utente di vedere il messaggio
      setTimeout(() => {
        navigate(`/quote/${quoteId}`);
      }, 1500);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Errore: ${error.message}`,
        severity: 'error'
      });
    }
  });
  
  // Funzione per cambiare il filtro della categoria
  const handleFilterChange = (newFilter) => {
    setFilterCategory(newFilter);
  };
  
  // Funzione per filtrare i prodotti
  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      // Filtro per categoria
      const matchesCategory = filterCategory === 'tutti' || product.categoria === filterCategory;
      
      // Filtro per testo di ricerca
      const matchesSearch = 
        searchTerm === '' || 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [products, filterCategory, searchTerm]);

  // Funzione per determinare il colore del tag della categoria
  const getCategoryTagType = (category) => {
    switch(category) {
      case 'enterprise':
        return 'tone1'; // blu
      case 'professional':
        return 'tone3'; // verde
      case 'hr':
        return 'tone5'; // arancione
      case 'cross':
        return 'tone7'; // viola
      default:
        return 'tone9'; // grigio
    }
  };
  
  // Funzione per aprire il drawer con il prodotto selezionato
  const handleOpenDrawer = (product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };
  
  // Funzione per chiudere il drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // Gestisce l'aggiunta all'offerta/preventivo
  const handleAddToOffer = (data) => {
    if (quoteId) {
      // Calcola il prezzo totale del prodotto configurato
      const calculateChargeTotal = (charge) => {
        const value = parseFloat(charge.value || 0);
        
        if (charge.model === 'PerUnit') {
          const unitPrice = charge.pricing?.[0]?.price || 0;
          return value * unitPrice;
        }
        
        if (charge.model === 'Volume') {
          const tiers = charge.pricing?.[0]?.tiers || [];
          if (tiers.length === 0 || value <= 0) return 0;
          const tier = tiers.find(t => value >= t.startingUnit && value <= t.endingUnit);
          return tier ? tier.price : 0;
        }
        
        if (charge.model === 'FlatFee') {
          return charge.pricing?.[0]?.price || 0;
        }
        
        return 0;
      };
      
      // Calcola il totale del prodotto
      const totalPrice = data.selectedRatePlan.productRatePlanCharges.reduce(
        (total, charge) => total + calculateChargeTotal(charge), 0
      );
      
      // Prepara il prodotto da aggiungere al preventivo con tutti i dettagli
      const productToAdd = {
        id: data.product.id,
        name: data.product.name,
        price: totalPrice,
        quantity: 1,
        category: data.product.categoria,
        description: data.product.description,
        // Informazioni sul rate plan selezionato
        ratePlan: {
          id: data.selectedRatePlan.id,
          name: data.selectedRatePlan.name,
          description: data.selectedRatePlan.description || ''
        },
        // Informazioni sulle charges configurate dall'utente
        charges: data.selectedRatePlan.productRatePlanCharges.map(charge => ({
          id: charge.id,
          name: charge.name,
          type: charge.type,
          model: charge.model,
          value: parseFloat(charge.value || 0),
          calculatedPrice: calculateChargeTotal(charge)
        }))
      };
      
      // Utilizza la mutation per aggiungere il prodotto
      addToQuoteMutation.mutate(productToAdd);
    } else {
      // Comportamento esistente quando non c'è un quoteId
      console.log('Prodotto aggiunto all\'offerta:', data);
      
      // Chiudi il drawer
      handleCloseDrawer();
    }
  };

  // Funzione per tornare al preventivo senza aggiungere nulla
  const handleReturnToQuote = () => {
    if (quoteId) {
      navigate(`/quote/${quoteId}`);
    }
  };

  // Funzione per tradurre nome categoria
  const translateCategory = (category) => {
    const translations = {
      'enterprise': 'Enterprise',
      'professional': 'Professional',
      'hr': 'HR',
      'cross': 'Cross'
    };
    return translations[category] || category || 'N/A';
  };
  
  // Gestione errori per il preventivo
  if (quoteError && quoteId) {
    return (
      <VaporPage>
        <VaporPage.Section>
          <Alert severity="error" sx={{ mb: 3 }}>
            Errore nel caricamento del preventivo: {quoteError.message}
          </Alert>
          <Button 
            variant="contained"
            onClick={() => navigate('/quotes')}
            startIcon={<VaporIcon icon={faArrowLeft} />}
          >
            Torna alla lista preventivi
          </Button>
        </VaporPage.Section>
      </VaporPage>
    );
  }

  // Configurazione delle colonne per DataGrid
  const columns = [
    { 
      field: 'name', 
      headerName: 'Nome', 
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography 
            variant="body2" 
            fontWeight="medium"
            sx={{ 
              whiteSpace: 'normal',
              lineHeight: 1.3,
              textAlign: 'left'
            }}
          >
            {params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'description', 
      headerName: 'Descrizione', 
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              whiteSpace: 'normal',
              lineHeight: 1.3,
              textAlign: 'left'
            }}
          >
            {params.value || 'Nessuna descrizione disponibile.'}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'categoria', 
      headerName: 'Categoria', 
      flex: 0.8,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Tag 
            label={translateCategory(params.value)} 
            type={getCategoryTagType(params.value)}
            size="small"
            variant='duotone'
          />
        </Box>
      )
    },
    { 
      field: 'productRatePlans', 
      headerName: 'Rate Plans', 
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          {params.value && params.value.length > 0 ? (
            <Typography 
              variant="body2"
              sx={{ 
                whiteSpace: 'normal',
                lineHeight: 1.3,
                textAlign: 'left'
              }}
            >
              {params.value.slice(0, 3).map(plan => plan.name).join(', ')}
              {params.value.length > 3 && ` e altri ${params.value.length - 3}...`}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nessun piano disponibile
            </Typography>
          )}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Azioni',
      flex: 0.8,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Button 
            variant="contained" 
            color="primary"
            size="small"
            onClick={() => handleOpenDrawer(params.row)}
            startIcon={<VaporIcon icon={faCirclePlus} />}
          >
            Aggiungi
          </Button>
        </Box>
      )
    }
  ];

  // Configurazione delle opzioni per DataGrid
  const gridOptions = {
    pageSize: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    pagination: true,
    autoHeight: true,
    hideFooterSelectedRowCount: true,
    disableColumnMenu: true,
    disableSelectionOnClick: true,
    getRowHeight: () => 'auto',
    sx: {
      '& .MuiDataGrid-cell': {
        maxHeight: 'none !important',
        whiteSpace: 'normal'
      }
    }
  };

  return (
      <VaporPage
        title="Catalogo Prodotti"
        contentToolbar={
          <VaporToolbar
            variant="surface"
            size="large"
            contentLeft={[
              // Bottono per tornare indietro
              quoteId ? (
                <Button 
                  variant="contained" 
                  onClick={handleReturnToQuote}
                  startIcon={<VaporIcon icon={faArrowLeft} />}
                >
                  Torna al Preventivo
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/"
                >
                  Torna alla Home
                </Button>
              )
            ]}
          />
        }
      >
        <VaporPage.Section divider>
          
          {/* Banner informativo se siamo in modalità "aggiungi a preventivo" */}
          {quoteId && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>            
              {/* Informazioni sul filtraggio per ruolo */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                backgroundColor: 'background.paper',
                p: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                width: '100%',
              }}>
                <VaporIcon icon={faInfoCircle} color="primary" size="lg" />
                <Typography variant="body2" color="text.secondary">
                  {isLoadingQuote ? <span>Caricamento informazioni preventivo...</span> : <span>Stai aggiungendo prodotti al preventivo:</span>} <strong>{quoteData?.number || quoteId}</strong> | Ruolo: <strong>{userRole}</strong> | Prodotti disponibili: <strong>{products.length}</strong> | Prodotti visibili: <strong>{filteredProducts.length}</strong>
                </Typography>
              </Box>
            </Box>
          )}
          
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              component="div"
              gutterBottom
              variant="headingsPage"
            >
              Cerca e seleziona un prodotto
            </Typography>
            <Typography
              component="div"
              gutterBottom
              variant="bodyLargeRegular"
            >
              {quoteId 
                ? 'Scegli un prodotto dal catalogo TeamSystem da aggiungere al preventivo' 
                : 'Scegli un prodotto dal catalogo TeamSystem da aggiungere all\'offerta'}
            </Typography>
          </Box>
          
          {/* Form di ricerca prodotti */}
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: '500px', mb: 3 }}>
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                handleClear={() => setSearchTerm("")}
                placeholder="Cerca per nome o descrizione..."
                size='medium'
                sx={{ width: '100%' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip 
                label="Tutti" 
                variant={filterCategory === 'tutti' ? 'filled' : 'outlined'}
                onClick={() => handleFilterChange('tutti')}
                color={filterCategory === 'tutti' ? 'primary' : 'default'}
              />
              
              {isLoadingCategories ? (
                <CircularProgress size="small" />
              ) : (
                categories.map(category => (
                  <Chip 
                    key={category}
                    label={translateCategory(category)}
                    variant={filterCategory === category ? 'filled' : 'outlined'}
                    onClick={() => handleFilterChange(category)}
                    color={filterCategory === category ? 'primary' : 'default'}
                  />
                ))
              )}
            </Box>
          </Box>
        </VaporPage.Section>

        <VaporPage.Section>
          {/* Toggle per cambiare vista */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <ButtonGroup variant="outlined" size="small">
              <Tooltip title="Vista a schede">
                <IconButton 
                  color={viewMode === 'cards' ? 'primary' : 'default'}
                  onClick={() => setViewMode('cards')}
                >
                  <VaporIcon icon={faTableCellsLarge} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Vista a tabella">
                <IconButton
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  onClick={() => setViewMode('grid')}
                >
                  <VaporIcon icon={faTableCells} />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          </Box>  

          {/* Visualizzazione dei prodotti */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              Errore durante il caricamento dei prodotti: {error.message}
            </Alert>
          ) : filteredProducts.length === 0 ? (
            <Alert severity="info">
              Nessun prodotto corrisponde ai criteri di ricerca o ai permessi del tuo ruolo.
            </Alert>
          ) : (
            <>
              {/* VISTA A SCHEDE (CARDS) */}
              {viewMode === 'cards' && (
                <Grid container spacing={3}>
                  {filteredProducts.map((product) => (
                    <Grid item xs={12} md={6} lg={4} xl={3} key={product.id}>
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        boxShadow: 2,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4
                        }
                      }}>
                        <CardContent sx={{ 
                          flex: 1, 
                          display: 'flex', 
                          flexDirection: 'column',
                          p: 2,
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ flex: 1 }}>
                              {product.name}
                            </Typography>
                            <Tag 
                              label={translateCategory(product.categoria)} 
                              type={getCategoryTagType(product.categoria)}
                              size="medium"
                              variant='duotone'
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ minHeight: '40px' }}>
                            {product.description || 'Nessuna descrizione disponibile.'}
                          </Typography>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Rate plans:
                            </Typography>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              {product.productRatePlans && product.productRatePlans.slice(0, 3).map((ratePlan, index) => (
                                <Typography component="li" variant="body2" key={index}>
                                  {ratePlan.name}
                                </Typography>
                              ))}
                              {product.productRatePlans && product.productRatePlans.length > 3 && (
                                <Typography component="li" variant="body2" fontStyle="italic">
                                  e altro...
                                </Typography>
                              )}
                            </ul>
                          </Box>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            justifyContent: 'flex-end',
                            mt: 'auto',
                            pt: 2
                          }}>                        
                            <Button 
                              variant="contained" 
                              color="primary"
                              size="small"
                              onClick={() => handleOpenDrawer(product)}
                              startIcon={<VaporIcon icon={faCirclePlus} />}
                            >
                              {quoteId ? 'Aggiungi al preventivo' : 'Aggiungi'}
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* VISTA A GRIGLIA (DATAGRID) */}
              {viewMode === 'grid' && (
                <Box sx={{ width: '100%', bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1 }}>
                  <DataGrid 
                    rows={filteredProducts} 
                    columns={columns} 
                    getRowId={(row) => row.id}
                    {...gridOptions}
                    sx={{
                      '.MuiDataGrid-cell': {
                        borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                        maxHeight: 'none !important',
                        whiteSpace: 'normal',
                        padding: '16px 8px'
                      },
                      '.MuiDataGrid-row': {
                        maxHeight: 'none !important'
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </VaporPage.Section>

        {/* Drawer component esterno */}
        <ProductDrawer 
          open={drawerOpen}
          onClose={handleCloseDrawer}
          product={selectedProduct}
          translateCategory={translateCategory}
          onAddToOffer={handleAddToOffer}
          isAddingToQuote={!!quoteId}  // Passa questa prop al drawer
        />
        
        {/* Componente Snackbar */}
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

export default CatalogPage;