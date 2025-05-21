import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  VaporPage,
  Typography,
  Button,
  Box,
  DatePicker,
  TextField,
  Switch,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  ExtendedTabs,
  ExtendedTab,
  Tab,
  Select,
  MenuItem,
  LocalizationProvider,
  AdapterDayjs,
  VaporToolbar,
  Card,
  CardContent,
  Divider,
  Tag,
  Title,
  VaporIcon,
  Snackbar,
  Alert,
  Paper,
  Chip
} from "@vapor/v3-components";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons/faArrowLeft";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons/faEllipsisVertical";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faFloppyDisk } from "@fortawesome/pro-regular-svg-icons/faFloppyDisk";
import { faPaperPlane } from "@fortawesome/pro-regular-svg-icons/faPaperPlane";
import dayjs from 'dayjs';
import ConfiguredProductList from '../components/ConfiguredProductList';

/**
* @component Quote
* @description Componente per la creazione e modifica di un preventivo
*/
function Quote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const isEditMode = !!id;

  // Stati per il componente
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Stati per i campi del form
  const [formState, setFormState] = useState({
    status: '',
    creationDate: null,
    type: '',
    notes: '',
    validityDate: null,
    warrantyStartDate: null,
    cancellationNoticeMonths: '',
    billingFrequency: '',
    renewable: false,
    istat: false,
    priceBlocked: false,
    customer: { name: '', sector: '' },
    value: 0,
    selectedProducts: []
  });

  // Query per caricare i dati del preventivo se siamo in modalità modifica
  const { data: quoteData, isLoading: isLoadingQuote, error: quoteError } = useQuery({
    queryKey: ['quote', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetch(`${API_URL}/quotes/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!id, // Esegui la query solo se c'è un ID
  });

  // Mutation per salvare o aggiornare un preventivo
  const saveQuoteMutation = useMutation({
    mutationFn: async (quoteData) => {
      const url = isEditMode 
        ? `${API_URL}/quotes/${id}` 
        : `${API_URL}/quotes`;
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Invalida la query per forzare un refresh
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      if (!isEditMode) {
        // Se era una creazione, reindirizza alla pagina di modifica
        navigate(`/quote/${data._id}`);
      }
      
      setSnackbar({
        open: true,
        message: isEditMode ? 'Preventivo aggiornato con successo' : 'Preventivo creato con successo',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Errore: ${error.message}`,
        severity: 'error'
      });
    }
  });

  // Aggiorna il form quando vengono caricati i dati
  useEffect(() => {
    if (quoteData) {
      setFormState({
        status: quoteData.status || '',
        creationDate: quoteData.createdAt ? dayjs(quoteData.createdAt) : null,
        type: quoteData.type || '',
        notes: quoteData.notes || '',
        validityDate: quoteData.validityDate ? dayjs(quoteData.validityDate) : null,
        warrantyStartDate: quoteData.warrantyStartDate ? dayjs(quoteData.warrantyStartDate) : null,
        cancellationNoticeMonths: quoteData.cancellationNoticeMonths || '',
        billingFrequency: quoteData.billingFrequency || '',
        renewable: quoteData.renewable || false,
        istat: quoteData.istat || false,
        priceBlocked: quoteData.priceBlocked || false,
        customer: quoteData.customer || { name: '', sector: '' },
        value: quoteData.value || 0,
        selectedProducts: quoteData.products || []
      });
    }
  }, [quoteData]);

  // Gestione cambio tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Gestione cambio di valore nei campi
  const handleInputChange = (field, value) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  // Gestione invio del form
  const handleSaveQuote = () => {
    // Trasforma i dati nel formato atteso dall'API
    const quoteToSave = {
      status: formState.status,
      type: formState.type,
      notes: formState.notes,
      validityDate: formState.validityDate ? formState.validityDate.toISOString() : null,
      warrantyStartDate: formState.warrantyStartDate ? formState.warrantyStartDate.toISOString() : null,
      cancellationNoticeMonths: formState.cancellationNoticeMonths,
      billingFrequency: formState.billingFrequency,
      renewable: formState.renewable,
      istat: formState.istat,
      priceBlocked: formState.priceBlocked,
      customer: formState.customer,
      value: calculateTotal(), // Calcolo del valore totale (basato sul prezzo cliente)
      products: formState.selectedProducts
    };
    
    saveQuoteMutation.mutate(quoteToSave);
  };

  // Funzione per rimuovere un prodotto dal preventivo
  const handleRemoveProduct = (productId) => {
    setFormState(prevState => ({
      ...prevState,
      selectedProducts: prevState.selectedProducts.filter(p => p.id !== productId)
    }));
  };

  // Funzione per aggiungere un prodotto (naviga al catalogo)
  const handleAddProduct = () => {
    navigate(`/catalog?quoteId=${id}`);
  };

  // Funzione per calcolare il totale di listino
  const calculateListTotal = () => {
    return formState.selectedProducts.reduce((total, product) => {
      return total + (product.price * (product.quantity || 1));
    }, 0);
  };

  // Funzione per calcolare il totale cliente
  const calculateTotal = () => {
    return formState.selectedProducts.reduce((total, product) => {
      // Utilizza prezzo cliente se disponibile, altrimenti usa prezzo di listino
      const effectivePrice = product.customerPrice || product.price;
      return total + (effectivePrice * (product.quantity || 1));
    }, 0);
  };

  // Funzione per tradurre le categorie
  const translateCategory = (category) => {
    return category; // In un'app reale potrebbe mappare a traduzioni
  };

  // Funzione per determinare il tipo di etichetta in base alla categoria
  const getCategoryTagType = (category) => {
    const categoryMap = {
      'Software': 'tone1',
      'Servizio': 'tone3',
      'Licenza': 'tone5',
      'Supporto': 'tone7',
      'Hardware': 'tone9'
    };
    return categoryMap[category] || 'tone1';
  };

  // Funzione per tornare alla pagina precedente
  const handleGoBack = () => {
    navigate('/quotes');
  };

  if (isLoadingQuote) {
    return (
      <VaporPage>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Typography>Caricamento preventivo in corso...</Typography>
        </Box>
      </VaporPage>
    );
  }

  if (quoteError && isEditMode) {
    return (
      <VaporPage>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Typography color="error">Errore nel caricamento del preventivo: {quoteError.message}</Typography>
        </Box>
      </VaporPage>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              onClick={() => navigate(`/catalog?quoteId=${id}`)}
            >
              Aggiungi articolo
            </Button>,
            <Button 
              key="save-quote" 
              size="small" 
              variant="outlined" 
              startIcon={<VaporIcon icon={faFloppyDisk} />}
              onClick={handleSaveQuote}
              disabled={saveQuoteMutation.isPending}
            >
              {saveQuoteMutation.isPending ? 'Salvataggio...' : 'Salva preventivo'}
            </Button>,
            <Button 
              key="send-quote" 
              size="small" 
              variant="outlined" 
              startIcon={<VaporIcon icon={faPaperPlane} />}
            >
              Invia al cliente
            </Button>,
            <IconButton key="options" size="small">
              <VaporIcon icon={faEllipsisVertical} size="xl" />
            </IconButton>
          ].filter(Boolean)} // Filtriamo gli elementi null
          size="small"
          title={isEditMode ? `Preventivo ${quoteData?.number || ''}` : 'Nuovo Preventivo'}
          description={formState.customer?.name ? `Cliente: ${formState.customer.name}` : undefined}
        />
        <VaporPage.Section>
          <ExtendedTabs value={activeTab} onChange={handleTabChange} size="small" variant="standard">
            <ExtendedTab label="Preventivo" />
            <ExtendedTab label="Cliente" />
            <ExtendedTab label="Documenti" />
          </ExtendedTabs>

          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
                Informazioni generali
              </Typography>
              
              <Grid container spacing={3}>
                {/* Prima riga (5 colonne) */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <Typography variant="body2" gutterBottom>Stato</Typography>
                    <Select
                      value={formState.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      displayEmpty
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="">Seleziona stato</MenuItem>
                      <MenuItem value="Draft">Bozza</MenuItem>
                      <MenuItem value="Sent">Inviato</MenuItem>
                      <MenuItem value="Accepted">Accettato</MenuItem>
                      <MenuItem value="Rejected">Rifiutato</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <Typography variant="body2" gutterBottom>Data di creazione</Typography>
                    <DatePicker 
                      value={formState.creationDate} 
                      onChange={(newValue) => handleInputChange('creationDate', newValue)} 
                      format="DD/MM/YYYY"
                      views={["day", "year", "month"]}
                      slotProps={{ textField: { size: 'small' } }}
                      readOnly={true}  // La data di creazione non dovrebbe essere modificabile
                    />
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <Typography variant="body2" gutterBottom>Tipologia di preventivo</Typography>
                    <Select
                      value={formState.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      displayEmpty
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="">Seleziona tipologia</MenuItem>
                      <MenuItem value="New">Nuovo</MenuItem>
                      <MenuItem value="Migration">Migrazione</MenuItem>
                      <MenuItem value="Upgrade">Upgrade</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <Typography variant="body2" gutterBottom>Data validità preventivo</Typography>
                    <DatePicker 
                      value={formState.validityDate} 
                      onChange={(newValue) => handleInputChange('validityDate', newValue)} 
                      format="DD/MM/YYYY"
                      views={["day", "year", "month"]}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <Typography variant="body2" gutterBottom>Data inizio assistenza software</Typography>
                    <DatePicker 
                      value={formState.warrantyStartDate} 
                      onChange={(newValue) => handleInputChange('warrantyStartDate', newValue)} 
                      format="DD/MM/YYYY"
                      views={["day", "year", "month"]}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </FormControl>
                </Grid>

                {/* Seconda riga (5 colonne) */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <Typography variant="body2" gutterBottom>Mesi prima della cancellazione</Typography>
                    <Select
                      value={formState.cancellationNoticeMonths}
                      onChange={(e) => handleInputChange('cancellationNoticeMonths', e.target.value)}
                      displayEmpty
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="">Seleziona</MenuItem>
                      <MenuItem value="1">1 mese</MenuItem>
                      <MenuItem value="3">3 mesi</MenuItem>
                      <MenuItem value="6">6 mesi</MenuItem>
                      <MenuItem value="12">12 mesi</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <Typography variant="body2" gutterBottom>Periodicità fatturazione</Typography>
                    <Select
                      value={formState.billingFrequency}
                      onChange={(e) => handleInputChange('billingFrequency', e.target.value)}
                      displayEmpty
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="">Seleziona</MenuItem>
                      <MenuItem value="mensile">Mensile</MenuItem>
                      <MenuItem value="trimestrale">Trimestrale</MenuItem>
                      <MenuItem value="semestrale">Semestrale</MenuItem>
                      <MenuItem value="annuale">Annuale</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2.4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={formState.renewable}
                          onChange={(e) => handleInputChange('renewable', e.target.checked)}
                        />
                      }
                      label="Rinnovabile"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2.4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={formState.istat}
                          onChange={(e) => handleInputChange('istat', e.target.checked)}
                        />
                      }
                      label="Istat"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2.4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={formState.priceBlocked}
                          onChange={(e) => handleInputChange('priceBlocked', e.target.checked)}
                        />
                      }
                      label="Price blocked"
                    />
                  </Box>
                </Grid>
                
                {/* Note aggiuntive (occupa 2 colonne su 5) */}
                <Grid item xs={12} sm={12} md={4.8}>
                  <FormControl fullWidth>
                    <Typography variant="body2" gutterBottom>Note aggiuntive</Typography>
                    <TextField
                      multiline
                      rows={4}
                      value={formState.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      fullWidth
                      placeholder="Inserisci eventuali note aggiuntive..."
                    />
                  </FormControl>
                </Grid>
              </Grid>
              
              {/* Sezione per gli articoli selezionati usando il componente estratto */}
              <Box sx={{ mt: 6, mb: 3 }}>
                <ConfiguredProductList
                  products={formState.selectedProducts}
                  onRemoveProduct={handleRemoveProduct}
                  onAddProduct={handleAddProduct}
                  translateCategory={translateCategory}
                  getCategoryTagType={getCategoryTagType}
                />
              </Box>
            </Box>
          )}
          
          {/* Tab Cliente */}
          {activeTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                Informazioni cliente
              </Typography>
              
              {isEditMode ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <Typography variant="body2" gutterBottom>Nome cliente</Typography>
                      <TextField
                        value={formState.customer?.name || ''}
                        fullWidth
                        placeholder="Nome del cliente"
                        size="small"
                        disabled
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                          style: {
                            backgroundColor: 'white',
                            color: 'rgba(0, 0, 0, 0.87)',
                            border: '1px solid #e0e0e0'
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <Typography variant="body2" gutterBottom>Settore</Typography>
                      <TextField
                        value={formState.customer?.sector || ''}
                        fullWidth
                        placeholder="Settore di attività"
                        size="small"
                        disabled
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                          style: {
                            backgroundColor: 'white',
                            color: 'rgba(0, 0, 0, 0.87)',
                            border: '1px solid #e0e0e0'
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <Typography variant="body2" gutterBottom>Email</Typography>
                      <TextField
                        value={formState.customer?.email || ''}
                        fullWidth
                        placeholder="Email del cliente"
                        size="small"
                        disabled
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                          style: {
                            backgroundColor: 'white',
                            color: 'rgba(0, 0, 0, 0.87)',
                            border: '1px solid #e0e0e0'
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: 4,
                  border: '1px dashed #ccc',
                  borderRadius: 2,
                  backgroundColor: '#f9f9f9'
                }}>
                  <Typography variant="body1" gutterBottom>
                    Seleziona un cliente esistente per associarlo a questo preventivo
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/customers')}
                  >
                    Seleziona cliente
                  </Button>
                </Box>
              )}
            </Box>
          )}
          
          {/* Tab Documenti */}
          {activeTab === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                Documenti associati
              </Typography>
              
              <Typography variant="body1" color="text.secondary">
                Questa sezione conterrà i documenti allegati al preventivo, come condizioni contrattuali e documentazione tecnica.
              </Typography>
            </Box>
          )}
        </VaporPage.Section>
      </VaporPage>

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
    </LocalizationProvider>
  );
}

export default Quote;