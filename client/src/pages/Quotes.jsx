// client/src/pages/Quotes.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
  Drawer,
  Title,
  IconButton,
  VaporIcon,
  SearchBar
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";
import { faPen } from "@fortawesome/pro-regular-svg-icons/faPen";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons/faEllipsisVertical";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons/faArrowLeft";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";

/**
 * @component QuotesPage
 * @description Pagina che mostra la lista dei preventivi
 */
function QuotesPage() {
  // URL base del backend
  const API_URL = import.meta.env.VITE_API_URL || '/api';
  
  // State per filtri ricerca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Mappa per tradurre gli stati in italiano per l'interfaccia
  const statusTranslations = {
    'All': 'Tutti',
    'Draft': 'Bozza',
    'Sent': 'Inviato',
    'Accepted': 'Accettato',
    'Rejected': 'Rifiutato',
    'Migration': 'Migrazione'
  };

  // Mappa per tradurre i tipi di preventivo in italiano
  const typeTranslations = {
    'New': 'Nuovo',
    'Migration': 'Migrazione'
  };
  
  // State per gestione drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // Query per ottenere le quotes
  const { 
    data: quotes = [], 
    isLoading, 
    error 
  } = useQuery({ 
    queryKey: ['quotes', filterStatus, searchTerm], 
    queryFn: async () => {
      let url = `${API_URL}/quotes`;
      
      // Costruisci la query string in base ai filtri
      const params = new URLSearchParams();
      if (filterStatus !== 'All') {
        params.append('status', filterStatus);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Aggiungi i parametri all'URL se presenti
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }
  });

  // Funzione per formattare la data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Funzione per formattare il valore come valuta
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Funzione per determinare il colore del tag in base allo stato
  const getStatusTagType = (status) => {
    switch(status) {
      case 'Draft': return 'info'; // blu
      case 'Sent': return 'success'; // verde
      case 'Accepted': return 'success'; // verde
      case 'Rejected': return 'error'; // rosso
      default: return 'tone8'; // viola
    }
  };

  // Funzione per determinare la variante del tag in base allo stato
  const getStatusTagVariant = (status) => {
    switch(status) {
      case 'Draft': return 'duotone'; // blu
      case 'Sent': return 'duotone'; // verde
      case 'Accepted': return 'filled'; // verde
      case 'Rejected': return 'filled'; // rosso
      default: return 'duotone'; // viola
    }
  };

  // Funzione per determinare la variante del tag in base al type
  const getTypeTagVariant = (type) => {
    switch(type) {
      case 'New': return 'filled';
      case 'Migration': return 'duotone';
      default: return 'filled';
    }
  };
  
  // Funzione per cambiare il filtro dello stato
  const handleFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
  };
  
  // Funzione per aprire il drawer con il preventivo selezionato
  const handleOpenDrawer = (quote) => {
    setSelectedQuote(quote);
    setDrawerOpen(true);
  };
  
  // Funzione per chiudere il drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <VaporPage>
      <Title
        leftItems={[
          <IconButton color="primary" size="small">
            <VaporIcon icon={faArrowLeft} size="xl" />
          </IconButton>
        ]}
        rightItems={[
          <Button key="1" size="small" variant="contained" startIcon={<VaporIcon icon={faPlus} />}>Nuovo preventivo</Button>,
          <IconButton key="2" size="small">
            <VaporIcon icon={faEllipsisVertical} size="xl" />
          </IconButton>
        ]}
        size="small"
        title="Preventivi"
      />
      <VaporPage.Section divider>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            component="div"
            gutterBottom
            variant="headingsPage"
          >
            Gestisci i tuoi preventivi
          </Typography>
          <Typography
            component="div"
            gutterBottom
            variant="bodyLargeRegular"
          >
            Visualizza, modifica e crea nuove offerte per i tuoi clienti
          </Typography>
        </Box>
        
        {/* Form di ricerca preventivi */}
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: '500px', mb: 3 }}>
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              handleClear={() => setSearchTerm("")}
              placeholder="Cerca per cliente, numero preventivo..."
              size='medium'
              sx={{ width: '100%' }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip 
              label="Tutti" 
              variant={filterStatus === 'All' ? 'filled' : 'outlined'}
              onClick={() => handleFilterChange('All')}
              color={filterStatus === 'All' ? 'primary' : 'default'}
            />
            
            {['Draft', 'Sent', 'Accepted', 'Rejected'].map(status => (
              <Chip 
                key={status}
                label={statusTranslations[status]}
                variant={filterStatus === status ? 'filled' : 'outlined'}
                onClick={() => handleFilterChange(status)}
                color={filterStatus === status ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </Box>
      </VaporPage.Section>

      <VaporPage.Section>
        <Typography
          component="div"
          gutterBottom
          variant="bodyLargeHeavy"
        >
          Preventivi Recenti
        </Typography>
        
        {/* Visualizzazione delle quotes */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Errore durante il caricamento dei preventivi: {error.message}
          </Alert>
        ) : quotes.length === 0 ? (
          <Alert severity="info">
            Nessun preventivo corrisponde ai criteri di ricerca.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {quotes.map((quote) => (
              <Grid item xs={12} md={6} lg={4} xl={3} key={quote._id}>
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
                        {quote.customer.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tag 
                          label={typeTranslations[quote.type]} 
                          type="warning"
                          size="medium"
                          variant={getTypeTagVariant(quote.type)}
                        />
                        <Tag 
                          label={statusTranslations[quote.status]} 
                          type={getStatusTagType(quote.status)}
                          size="medium"
                          variant={getStatusTagVariant(quote.status)}
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {quote.customer.sector}
                    </Typography>
                    
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 2 }}>
                      Preventivo #{quote.number}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Data
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(quote.date)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                          Valore
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {formatCurrency(quote.value)}/anno
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                        component={Link}
                        to={`/quote/${quote._id}/edit`}
                        startIcon={<VaporIcon icon={faPen} />}
                      >
                        Modifica
                      </Button>
                      <IconButton 
                        variant="outlined" 
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDrawer(quote)}
                      >
                        <VaporIcon icon={faEllipsisVertical} size="xl" />
                      </IconButton>
                      

                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </VaporPage.Section>

      {/* Drawer con dettagli preventivo */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        width="30vw"
        hideBackdrop={false}
        sx={{ "& .MuiDrawer-paperAnchorRight": { marginTop: "48px" } }}
      >
        {selectedQuote && (
          <>
            <Title
              title={selectedQuote.customer.name}
              description={`Preventivo #${selectedQuote.number}`}
              divider
              rightItems={[
                <IconButton size="small" variant='outlined' onClick={handleCloseDrawer}>
                  <VaporIcon icon={faClose} size="xl" />
                </IconButton>
              ]}
            />
            
            <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" fontWeight="medium">
                  Settore: {selectedQuote.customer.sector}
                </Typography>
                <Tag 
                  label={statusTranslations[selectedQuote.status]} 
                  type={getStatusTagType(selectedQuote.status)}
                  size="medium"
                  variant='duotone'
                />
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Dettagli preventivo
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Data</Typography>
                  <Typography variant="body1" fontWeight="medium">{formatDate(selectedQuote.date)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Valore totale</Typography>
                  <Typography variant="body1" fontWeight="bold">{formatCurrency(selectedQuote.value)}/anno</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Prodotti inclusi
              </Typography>
              
              {selectedQuote.products && selectedQuote.products.length > 0 ? (
                <Box sx={{ mb: 3 }}>
                  {selectedQuote.products.map((product, index) => (
                    <Card key={index} sx={{ mb: 2, boxShadow: 1 }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="medium">{product.name}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2">
                            Quantità: {product.quantity}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(product.price * product.quantity)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Nessun prodotto incluso in questo preventivo.
                </Typography>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              {selectedQuote.notes && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Note
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedQuote.notes || "Nessuna nota disponibile."}
                  </Typography>
                </>
              )}
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
                  component={Link}
                  to={`/quote/${selectedQuote._id}/edit`}
                >
                  Modifica preventivo
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

export default QuotesPage;