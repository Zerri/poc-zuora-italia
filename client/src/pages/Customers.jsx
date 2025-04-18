import React from 'react';
import { useQuery } from '@tanstack/react-query';
import VaporPage from "@vapor/v3-components/VaporPage";
import Typography from "@vapor/v3-components/Typography";
import { Button, VaporToolbar, CircularProgress, Alert, Card, CardContent, Chip, Divider, Grid, Box } from "@vapor/v3-components";
import { Link } from 'react-router-dom';

/**
 * @component CustomersPage
 * @description Pagina che mostra la lista dei clienti importati dal database
 */
function CustomersPage() {
  // URL base del backend (configurato per ambiente di sviluppo)
  const API_URL = import.meta.env.VITE_API_URL || '/api';

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

  return (
    <VaporPage
      title="Gestione Clienti"
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
        <Typography variant="h4" component="h1" gutterBottom>
          Lista Clienti
        </Typography>
        <Typography variant="bodyInterfaceLargeExtended" paragraph>
          Visualizzazione di tutti i clienti presenti nel sistema
        </Typography>
      </VaporPage.Section>

      {/* Visualizzazione dei clienti */}
      <VaporPage.Section>
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
        ) : (
          <Grid container spacing={3}>
            {customers.map((customer) => (
              <Grid item xs={12} md={6} lg={4} key={customer._id}>
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
                      <Chip 
                        label={customer.tipo} 
                        color={customer.tipo === 'Cliente' ? 'success' : 'warning'}
                        size="small"
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