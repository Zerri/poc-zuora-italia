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
  const discount = hasCustomPrice && product.customerPrice > 0 ? 
    ((product.price - product.customerPrice) / product.price * 100).toFixed(2) : 0;
  
  // Prezzo da usare per i calcoli (prezzo cliente se disponibile, altrimenti prezzo di listino)
  const effectivePrice = product.customerPrice || product.price;
  
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: 1,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 3
      }
    }}>
      <CardContent sx={{ 
        p: 2, 
        '&:last-child': { pb: 2 },
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* Header con nome e tag categoria */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle1" component="h3" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 0.5 }}>
            {product.name}
          </Typography>
          {product.category && (
            <Box sx={{ mb: 1 }}>
              <Tag 
                label={translateCategory ? translateCategory(product.category) : product.category} 
                type={getCategoryTagType ? getCategoryTagType(product.category) : 'tone1'}
                size="small"
                variant='duotone'
              />
            </Box>
          )}
        </Box>
        
        {/* Descrizione */}
        <Box sx={{ mb: 1.5, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            minHeight: '40px'
          }}>
            {product.description || 'Nessuna descrizione disponibile'}
          </Typography>
        </Box>
        
        {/* Informazioni sul Rate Plan */}
        {product.ratePlan && (
          <Box sx={{ 
            py: 1,
            px: 1.5,
            bgcolor: 'grey.50',
            borderRadius: 1,
            mb: 1.5
          }}>
            <Typography variant="body2" color="text.primary" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>
              Piano: {product.ratePlan.name}
            </Typography>
            {product.charges && product.charges.length > 0 && (
              <Box sx={{ mt: 0.5 }}>
                {product.charges.slice(0, 2).map((charge, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {charge.name}: {charge.value} ({formatPrice(charge.calculatedPrice)})
                  </Typography>
                ))}
                {product.charges.length > 2 && (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ fontSize: '0.75rem' }}>
                    ...e altri componenti
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
        
        {/* Sezione prezzi compatta */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              Prezzo di listino:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              {formatPrice(product.price * (product.quantity || 1))}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
                Prezzo cliente:
              </Typography>
              {discount > 0 && (
                <Chip 
                  label={`-${discount}%`}
                  color="success"
                  size="small"
                  sx={{ fontSize: '0.65rem', height: '18px' }}
                />
              )}
            </Box>
            <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
              {formatPrice(effectivePrice * (product.quantity || 1))}
            </Typography>
          </Box>
        </Box>
        
        {/* Azioni */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {onRemove && (
            <Button 
              variant="contained" 
              color="error"
              size="small"
              onClick={() => onRemove(product.id)}
              sx={{ fontSize: '0.9rem', py: 0.5, px: 1.5 }}
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