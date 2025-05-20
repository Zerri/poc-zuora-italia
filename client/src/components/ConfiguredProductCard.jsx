import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Tag,
  Chip,
  Divider,
  Box,
  Button
} from "@vapor/v3-components";

/**
 * @component ConfiguredProductCard
 * @description Card che mostra un prodotto configurato, con dettagli su prezzo, rate plan e sconti.
 * Utilizzabile in preventivi e altre visualizzazioni
 * 
 * @param {Object} product - Il prodotto configurato da visualizzare
 * @param {Function} onRemove - Funzione chiamata quando il prodotto viene rimosso
 * @param {Function} translateCategory - Funzione per tradurre le categorie
 * @param {Function} getCategoryTagType - Funzione per determinare il tipo di tag
 * @param {Function} formatPrice - Funzione per formattare i prezzi
 */
function ConfiguredProductCard({ 
  product, 
  onRemove, 
  translateCategory, 
  getCategoryTagType,
  formatPrice = (price) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)
}) {
  // Calcola lo sconto se c'è un prezzo cliente personalizzato
  const hasCustomPrice = product.customerPrice && product.customerPrice !== product.price;
  const discount = hasCustomPrice ? 
    ((product.price - product.customerPrice) / product.price * 100).toFixed(2) : 0;
  
  // Prezzo da usare per i calcoli (prezzo cliente se disponibile, altrimenti prezzo di listino)
  const effectivePrice = product.customerPrice || product.price;
  
  return (
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
      <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle1" component="h3" fontWeight="bold" sx={{ flex: 1 }}>
            {product.name}
          </Typography>
          {product.category && (
            <Tag 
              label={translateCategory ? translateCategory(product.category) : product.category} 
              type={getCategoryTagType ? getCategoryTagType(product.category) : 'tone1'}
              size="small"
              variant='duotone'
            />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ minHeight: '40px' }}>
          {product.description || 'Nessuna descrizione disponibile'}
        </Typography>
        
        <Divider sx={{ my: 1 }} />
        
        {/* Informazioni sul Rate Plan */}
        {product.ratePlan && (
          <Box sx={{ my: 1 }}>
            <Typography variant="body2" color="text.primary" fontWeight="bold">
              Piano: {product.ratePlan.name}
            </Typography>
            {product.charges && product.charges.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {product.charges.slice(0, 2).map((charge, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary">
                    {charge.name}: {charge.value} ({formatPrice(charge.calculatedPrice)})
                  </Typography>
                ))}
                {product.charges.length > 2 && (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    ...e altri componenti
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
        
        <Divider sx={{ my: 1 }} />
        
        {/* Sezione prezzi di listino e cliente */}
        <Box sx={{ my: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Prezzo di listino:
            </Typography>
            <Typography variant="body2">
              {formatPrice(product.price * (product.quantity || 1))}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" fontWeight="bold">
              Prezzo cliente:
              {discount > 0 && (
                <Chip 
                  label={`-${discount}%`}
                  color="success"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {formatPrice(effectivePrice * (product.quantity || 1))}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="body1" fontWeight="bold">
            Totale: {formatPrice(effectivePrice * (product.quantity || 1))}
          </Typography>
          
          {onRemove && (
            <Button 
              variant="contained" 
              color="error"
              size="small"
              onClick={() => onRemove(product.id)}
            >
              Rimuovi
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ConfiguredProductCard;