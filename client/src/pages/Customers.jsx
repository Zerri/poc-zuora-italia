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
} from "@vapor/v3-components";
import SearchBar from "@vapor/v3-components/SearchBar";
import { Link } from 'react-router-dom';

/**
 * @component CustomersPage
 * @description Pagina che mostra la lista dei clienti importati dal database
 */
function CustomersPage() {
  // URL base del backend (configurato per ambiente di sviluppo)
  const API_URL = import.meta.env.VITE_API_URL || '/api';
  
  // State per filtri ricerca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tutti');

  // Query per ottenere i customers
  const { 
    data: customers = [], 
    isLoading, 
    error 
  } = useQuery({ 
    queryKey: ['customers'], 
    queryFn: async () => {
      const response = await fetch(`${API_URL}/customers`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }
  });

  // Funzione per formattare la data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('it-IT');
  };
  
  // Funzione per cambiare il filtro
  const handleFilterChange = (newFilter) => {
    setFilterType(newFilter);
  };
  
  // Funzione per filtrare i clienti
  const filteredCustomers = React.useMemo(() => {
    return customers.filter(customer => {
      // Filtro per tipo (Cliente, Prospect, o Tutti)
      const matchesType = filterType === 'Tutti' || customer.tipo === filterType;
      
      // Filtro per testo di ricerca
      const matchesSearch = 
        searchTerm === '' || 
        customer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.settore.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesType && matchesSearch;
    });
  }, [customers, filterType, searchTerm]);

  return (
    <VaporPage
      title="Clienti"
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
            Cerca e seleziona un cliente
          </Typography>
          <Typography
            component="div"
            gutterBottom
            variant="bodyLargeRegular"
          >
            Inizia una nuova offerta selezionando un Cliente o Prospect
          </Typography>
        </Box>
        
        {/* Form di ricerca clienti */}
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: '500px', mb: 3 }}>
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              handleClear={() => setSearchTerm("")}
              placeholder="Cerca per nome settore o email..."
              size='medium'
              sx={{ width: '100%' }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Chip 
              label="Tutti" 
              variant={filterType === 'Tutti' ? 'filled' : 'outlined'}
              onClick={() => handleFilterChange('Tutti')}
              color={filterType === 'Tutti' ? 'primary' : 'default'}
            />
            <Chip 
              label="Cliente" 
              variant={filterType === 'Cliente' ? 'filled' : 'outlined'}
              onClick={() => handleFilterChange('Cliente')}
              color={filterType === 'Cliente' ? 'primary' : 'default'}
            />
            <Chip 
              label="Prospect" 
              variant={filterType === 'Prospect' ? 'filled' : 'outlined'}
              onClick={() => handleFilterChange('Prospect')}
              color={filterType === 'Prospect' ? 'primary' : 'default'}
            />
          </Box>
        </Box>
      </VaporPage.Section>

      <VaporPage.Section>
        <Typography
          component="div"
          gutterBottom
          variant="bodyLargeHeavy"
        >
          Recenti
        </Typography>
        
        {/* Visualizzazione dei clienti */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Errore durante il caricamento dei clienti: {error.message}
          </Alert>
        )}
        
        {customers.length === 0 && !isLoading ? (
          <Alert severity="info">
            Nessun cliente trovato nel database.
          </Alert>
        ) : filteredCustomers.length === 0 ? (
          <Alert severity="info">
            Nessun cliente corrisponde ai criteri di ricerca.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredCustomers.map((customer) => (
              <Grid item xs={12} md={6} lg={4} xl={3} key={customer._id}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2" fontWeight="bold">
                        {customer.nome}
                      </Typography>
                      <Tag 
                        label={customer.tipo} 
                        type={customer.tipo === 'Cliente' ? 'tone3' : 'tone7'}
                        size="medium"
                        variant='duotone'
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {customer.settore}
                    </Typography>
                    
                    <Typography variant="body2">
                      {customer.email}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Ultimo contatto
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(customer.ultimoContatto)}
                      </Typography>
                    </Box>
                    
                    {customer.valoreAnnuo && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Valore
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {customer.valoreAnnuo}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                        startIcon={<span>+</span>}
                      >
                        Nuova offerta
                      </Button>
                      
                      {customer.tipo === 'Cliente' && (
                        <Button 
                          variant="outlined" 
                          color="primary"
                          size="small"
                        >
                          Migrazione
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </VaporPage.Section>
    </VaporPage>
  );
}

export default CustomersPage;