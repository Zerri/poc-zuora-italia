// client/src/components/Migration/MigrationPathSelector.jsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Grid,
  VaporIcon
} from "@vapor/v3-components";
import { faCloudArrowUp } from "@fortawesome/pro-regular-svg-icons/faCloudArrowUp";
import { faServer } from "@fortawesome/pro-regular-svg-icons/faServer";

/**
 * @component MigrationPathSelector
 * @description Componente che permette all'utente di selezionare un percorso di migrazione
 * tra diverse opzioni disponibili (es. SaaS vs IaaS)
 */
function MigrationPathSelector({ paths, onSelectPath, currentValue = 0 }) {
  // Funzione per formattare i prezzi come valuta
  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(price);
  };
  
  // Funzione per calcolare il cambio percentuale
  const calculatePercentChange = (newValue, oldValue) => {
    if (oldValue === 0) return "+100%";
    const change = ((newValue - oldValue) / oldValue) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  // Determina il colore del cambio percentuale (verde se risparmio, rosso se aumento)
  const getChangeColor = (change) => {
    if (change.startsWith('+')) return 'error.main';
    return 'success.main';
  };

  // Determina l'icona del percorso in base all'ID
  const getPathIcon = (pathId) => {
    if (pathId === 'saas') return faCloudArrowUp;
    if (pathId === 'iaas') return faServer;
    return faCloudArrowUp; // Icona predefinita
  };
  
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Scegli un percorso di migrazione
        </Typography>
        <Typography variant="bodySmallRegular" color="text.secondary">
          Il sistema ha identificato due percorsi di migrazione compatibili con la sottoscrizione del cliente. Seleziona quello più adatto in base alle esigenze operative e agli obiettivi del cliente.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {Object.values(paths).map((path) => {
          // Determina se il percorso offre un risparmio o un aumento di costo
          const percentChange = path.percentChange || calculatePercentChange(path.totalValue, currentValue);
          
          return (
            <Grid item xs={12} md={6} key={path.id}>
              <Card sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                },
                border: '1px solid',
                borderColor: 'divider'
              }}
              onClick={() => onSelectPath(path.id)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      mr: 2
                    }}>
                      <VaporIcon icon={getPathIcon(path.id)} size="lg" />
                    </Box>
                    <Typography variant="h6" component="h3">
                      {path.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {path.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Vantaggi principali:
                  </Typography>
                  
                  <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    {path.benefits && path.benefits.map((benefit, idx) => (
                      <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                        {benefit}
                      </Typography>
                    ))}
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Costo stimato:
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {formatPrice(path.totalValue)}/anno
                      </Typography>
                      <Typography variant="caption" color={getChangeColor(percentChange)}>
                        {percentChange} rispetto all'attuale
                      </Typography>
                    </Box>
                    
                    <Button 
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Seleziona
                    </Button>
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {path.products ? path.products.length : 0} prodotti proposti
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default MigrationPathSelector;