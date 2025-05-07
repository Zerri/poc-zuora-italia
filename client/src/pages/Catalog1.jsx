// File modificato: client/src/pages/Catalog1.jsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Aggiungi queste importazioni
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
  // Aggiungi questo import
  Snackbar
} from "@vapor/v3-components";
import { faCirclePlus } from "@fortawesome/pro-regular-svg-icons/faCirclePlus";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons/faArrowLeft"; // Aggiungi questa icona
import SearchBar from "@vapor/v3-components/SearchBar";
import { Link } from 'react-router-dom';
import ProductDrawer from '../components/ProductDrawer';

/**
 * @component CatalogPage
 * @description Pagina che mostra il catalogo prodotti TeamSystem
 */
function CatalogPage() {
  // URL base del backend (configurato per ambiente di sviluppo)
  const API_URL = import.meta.env.VITE_API_URL || '/api';
  
  // Per la gestione delle query
  const queryClient = useQueryClient();
  
  // State per filtri ricerca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('tutti');
  
  // State per gestione drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Aggiungi questa parte per gestire i messaggi
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  // Aggiungi queste righe per il recupero del quoteId
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quoteId = searchParams.get('quoteId');

  // Query per ottenere i prodotti
  const { 
    data: products = [], 
    isLoading, 
    error 
  } = useQuery({ 
    queryKey: ['products'], 
    queryFn: async () => {
      const response = await fetch(`${API_URL}/products1`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }
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
  
  // Funzione per formattare il prezzo
  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  // Funzione per filtrare i prodotti
  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      // Filtro per categoria
      const matchesCategory = filterCategory === 'tutti' || product.categoria === filterCategory;
      
      // Filtro per testo di ricerca
      const matchesSearch = 
        searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
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

  // Modifica questa funzione per gestire l'aggiunta all'offerta/preventivo
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

  return (
      <VaporPage
        title="Catalogo Prodotti"
        contentToolbar={
          <VaporToolbar
            variant="surface"
            size="large"
            contentLeft={[
              // Modifica questa parte per mostrare il bottone corretto in base al contesto
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
          {/* Aggiungi un banner informativo se siamo in modalità "aggiungi a preventivo" */}
          {quoteId && (
            <Alert severity="info" sx={{ mb: 3 }}>
              {isLoadingQuote ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size="small" />
                  <span>Caricamento informazioni preventivo...</span>
                </Box>
              ) : (
                <>
                  Stai aggiungendo prodotti al preventivo: 
                  <strong>{quoteData?.number || quoteId}</strong>
                </>
              )}
            </Alert>
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
          <Typography
            component="div"
            gutterBottom
            variant="bodyLargeHeavy"
          >
            Catalogo Prodotti
          </Typography>
          
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
              Nessun prodotto corrisponde ai criteri di ricerca.
            </Alert>
          ) : (
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
        
        {/* Aggiungi il componente Snackbar */}
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