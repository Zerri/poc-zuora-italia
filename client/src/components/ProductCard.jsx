// client/src/components/ProductCard.jsx
import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Tag,
  Divider,
  Box,
  Button,
  VaporIcon
} from "@vapor/v3-components";
import { faCirclePlus } from "@fortawesome/pro-regular-svg-icons/faCirclePlus";

/**
 * @component ProductCard
 * @description Card che mostra i dettagli di un prodotto del catalogo con azioni disponibili
 * 
 * @param {Object} product - I dati del prodotto da visualizzare
 * @param {Function} onAddProduct - Funzione chiamata quando si clicca su "Aggiungi"
 * @param {Function} translateCategory - Funzione per tradurre le categorie
 * @param {Function} getCategoryTagType - Funzione per determinare il tipo di tag della categoria
 * @param {boolean} isAddingToQuote - Flag per indicare se stiamo aggiungendo a un preventivo
 */
function ProductCard({ 
  product,
  onAddProduct,
  isAddingToQuote = false
}) {
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
        {/* Header con nome prodotto */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle1" component="h2" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 0.5 }}>
            {product.name}
          </Typography>
        </Box>
        
        {/* Descrizione */}
        <Box sx={{ mb: 1.5, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            minHeight: '30px'
          }}>
            {product.description || 'Nessuna descrizione disponibile.'}
          </Typography>
        </Box>
        
        {/* Rate Plans compatti */}
        <Box sx={{ 
          py: 1,
          px: 1.5,
          bgcolor: 'grey.50',
          borderRadius: 1,
          mb: 1.5
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Rate plans disponibili:
          </Typography>
          {product.productRatePlans && product.productRatePlans.length > 0 ? (
            <Box>
              {product.productRatePlans.slice(0, 2).map((ratePlan, index) => (
                <Typography key={index} variant="body2" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                  • {ratePlan.name}
                </Typography>
              ))}
              {product.productRatePlans.length > 2 && (
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'text.secondary' }}>
                  +{product.productRatePlans.length - 2} altri piani...
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              Nessun piano disponibile
            </Typography>
          )}
        </Box>
        
        {/* Azioni */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            color="primary"
            size="small"
            fullWidth
            onClick={() => onAddProduct(product)}
            startIcon={<VaporIcon icon={faCirclePlus} />}
            sx={{ fontSize: '0.9rem', py: 0.75 }}
          >
            {isAddingToQuote ? 'Aggiungi al preventivo' : 'Aggiungi'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductCard;