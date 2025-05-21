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
  SearchBar,
  DataGrid,
  ButtonGroup,
  Tooltip
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";
import { faPen } from "@fortawesome/pro-regular-svg-icons/faPen";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons/faEllipsisVertical";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons/faArrowLeft";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faTableCells } from "@fortawesome/pro-regular-svg-icons/faTableCells";
import { faTableCellsLarge } from "@fortawesome/pro-regular-svg-icons/faTableCellsLarge";

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
  
  // State per la vista (cards o griglia)
  const [viewMode, setViewMode] = useState('cards');
  
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
    'Migration': 'Migrazione',
    'Upgrade': 'Upgrade'
  };
  
  // State per gestione drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // Funzione per calcolare il valore totale del preventivo dai prodotti
  const calculateQuoteValue = (products) => {
    if (!products || products.length === 0) return 0;
    
    return products.reduce((total, product) => {
      // Usa il prezzo cliente se disponibile, altrimenti usa il prezzo standard
      const effectivePrice = product.customerPrice || product.price || 0;
      const quantity = product.quantity || 1;
      return total + (effectivePrice * quantity);
    }, 0);
  };

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

  // Configurazione delle colonne per DataGrid
  const columns = [
    { 
      field: 'number', 
      headerName: 'Numero', 
      flex: 1,
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
      field: 'customer', 
      headerName: 'Cliente', 
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography 
            variant="body2" 
            fontWeight="medium"
            sx={{ 
              whiteSpace: 'normal',
              lineHeight: 1.3,
              textAlign: 'left',
              display: 'block',
            }}
          >
            {params.value.name}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              whiteSpace: 'normal',
              lineHeight: 1.3,
              textAlign: 'left',
              display: 'block',
            }}
          >
            {params.value.sector}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'status', 
      headerName: 'Stato', 
      flex: 0.8,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Tag 
            label={statusTranslations[params.value]} 
            type={getStatusTagType(params.value)}
            size="small"
            variant={getStatusTagVariant(params.value)}
          />
        </Box>
      )
    },
    { 
      field: 'type', 
      headerName: 'Tipo', 
      flex: 0.8,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Tag 
            label={typeTranslations[params.value]} 
            type="warning"
            size="small"
            variant={getTypeTagVariant(params.value)}
          />
        </Box>
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Data creazione', 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2">
            {formatDate(params.value)}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'value', 
      headerName: 'Valore', 
      flex: 1,
      renderCell: (params) => {
        const calculatedValue = params.row.products && params.row.products.length > 0 
          ? calculateQuoteValue(params.row.products) 
          : params.value;
        
        return (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              {formatCurrency(calculatedValue)}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Azioni',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ py: 1, display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            color="primary"
            size="small"
            component={Link}
            to={`/quote/${params.row._id}`}
            startIcon={<VaporIcon icon={faPen} />}
          >
            Modifica
          </Button>
          <IconButton 
            variant="outlined" 
            color="primary"
            size="small"
            onClick={() => handleOpenDrawer(params.row)}
          >
            <VaporIcon icon={faEllipsisVertical} size="lg" />
          </IconButton>
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
    <VaporPage>
      <Title
        rightItems={[
          <Button key="1" size="small" variant="contained" component={Link} to="/quote" startIcon={<VaporIcon icon={faPlus} />}>Nuovo preventivo</Button>,
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
        {/* Intestazione con il toggle per cambiare vista */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            component="div"
            variant="bodyLargeHeavy"
          >
            Preventivi Recenti
          </Typography>
          
          {/* Toggle per cambiare vista */}
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
          <>
            {/* VISTA A SCHEDE (CARDS) */}
            {viewMode === 'cards' && (
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
                              Creato il
                            </Typography>
                            <Typography variant="body1">
                              {formatDate(quote.createdAt)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="text.secondary">
                              Valore
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {formatCurrency(quote.products && quote.products.length > 0 ? calculateQuoteValue(quote.products) : quote.value)}/anno
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                          <Button 
                            variant="contained" 
                            color="primary"
                            size="small"
                            component={Link}
                            to={`/quote/${quote._id}`}
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
            
            {/* VISTA A GRIGLIA (DATAGRID) */}
            {viewMode === 'grid' && (
              <Box sx={{ width: '100%', bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1 }}>
                <DataGrid 
                  rows={quotes} 
                  columns={columns} 
                  getRowId={(row) => row._id}
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tag 
                    label={typeTranslations[selectedQuote.type]} 
                    type="warning"
                    size="medium"
                    variant={getTypeTagVariant(selectedQuote.type)}
                  />
                  <Tag 
                    label={statusTranslations[selectedQuote.status]} 
                    type={getStatusTagType(selectedQuote.status)}
                    size="medium"
                    variant={getStatusTagVariant(selectedQuote.status)}
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Dettagli preventivo
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Creato il</Typography>
                  <Typography variant="body1" fontWeight="medium">{formatDate(selectedQuote.createdAt)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Valore totale</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(selectedQuote.products && selectedQuote.products.length > 0 ? calculateQuoteValue(selectedQuote.products) : selectedQuote.value)}/anno
                  </Typography>
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
                  to={`/quote/${selectedQuote._id}`}
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