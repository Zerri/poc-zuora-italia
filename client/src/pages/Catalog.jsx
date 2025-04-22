import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import VaporPage from "@vapor/v3-components/VaporPage";
import Typography from "@vapor/v3-components/Typography";
import { 
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
  Drawer,
  Title,
  IconButton,
  VaporIcon
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";
import SearchBar from "@vapor/v3-components/SearchBar";
import { Link } from 'react-router-dom';

/**
 * @component CatalogPage
 * @description Pagina che mostra il catalogo prodotti TeamSystem
 */
function CatalogPage() {
  // URL base del backend (configurato per ambiente di sviluppo)
  const API_URL = import.meta.env.VITE_API_URL || '/api';
  
  // State per filtri ricerca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('tutti');
  
  // State per gestione drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Query per ottenere i prodotti
  const { 
    data: products = [], 
    isLoading, 
    error 
  } = useQuery({ 
    queryKey: ['products'], 
    queryFn: async () => {
      const response = await fetch(`${API_URL}/products`);
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
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descrizione.toLowerCase().includes(searchTerm.toLowerCase());
      
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

  // Funzione per tradurre nome categoria
  const translateCategory = (category) => {
    const translations = {
      'enterprise': 'Enterprise',
      'professional': 'Professional',
      'hr': 'HR',
      'cross': 'Cross'
    };
    return translations[category] || category;
  };

  // Componente per X icon (potrebbe essere necessario importare un'icona reale da Vapor)
  const CloseIcon = () => <span>✕</span>;

  return (
      <VaporPage
        title="Catalogo Prodotti"
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
              Scegli un prodotto dal catalogo TeamSystem da aggiungere all'offerta
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
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h2" fontWeight="bold" sx={{ flex: 1 }}>
                          {product.nome}
                        </Typography>
                        <Tag 
                          label={translateCategory(product.categoria)} 
                          type={getCategoryTagType(product.categoria)}
                          size="medium"
                          variant='duotone'
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ minHeight: '40px' }}>
                        {product.descrizione}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Caratteristiche principali:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {product.caratteristiche && product.caratteristiche.slice(0, 3).map((feature, index) => (
                            <Typography component="li" variant="body2" key={index}>
                              {feature}
                            </Typography>
                          ))}
                          {product.caratteristiche && product.caratteristiche.length > 3 && (
                            <Typography component="li" variant="body2" fontStyle="italic">
                              e altro...
                            </Typography>
                          )}
                        </ul>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Prezzo base
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {formatPrice(product.prezzo)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                        <Button 
                          variant="outlined" 
                          color="primary"
                          size="small"
                          onClick={() => handleOpenDrawer(product)}
                        >
                          Dettagli
                        </Button>
                        
                        <Button 
                          variant="contained" 
                          color="primary"
                          size="small"
                          startIcon={<span>+</span>}
                        >
                          Aggiungi
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </VaporPage.Section>

      {/* Drawer con dettagli prodotto */}
      
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        width="30vw"
        hideBackdrop={false}
        sx={{ "& .MuiDrawer-paperAnchorRight": { marginTop: "48px" } }}
      >
        {selectedProduct && (
          <>
            <Title
              title={selectedProduct.nome}
              description={translateCategory(selectedProduct.categoria)}
              divider
              rightItems={[
                <IconButton size="small" variant='outlined' onClick={handleCloseDrawer}>
                  <VaporIcon icon={faClose} size="xl" />
                </IconButton>
              ]}
            />
            
            <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
              <Typography variant="body1" paragraph>
                {selectedProduct.descrizione}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Caratteristiche del prodotto
              </Typography>
              
              <ul style={{ paddingLeft: '20px' }}>
                {selectedProduct.caratteristiche && selectedProduct.caratteristiche.map((feature, index) => (
                  <Typography component="li" variant="body1" key={index} gutterBottom>
                    {feature}
                  </Typography>
                ))}
              </ul>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Prezzo base
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatPrice(selectedProduct.prezzo)}
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, 
                nisi nisl consectetur nisi, euismod nisi nisl consectetur nisi.
              </Typography>
              
              <Typography variant="body1" paragraph>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </Typography>
            </Box>
            
            <VaporToolbar
              contentRight={[
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={handleCloseDrawer}
                >
                  Chiudi
                </Button>,
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<span>+</span>}
                >
                  Aggiungi all'offerta
                </Button>
              ]}
              size="medium"
              variant="regular"
              withoutAppBar
            />
          </>
        )}
      </Drawer>
      </VaporPage>
      


  );
}

export default CatalogPage;