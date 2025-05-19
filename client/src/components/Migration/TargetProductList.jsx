// client/src/components/migration/TargetProductList.jsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Tag,
  Button,
  Grid,
  IconButton,
  VaporIcon,
  Tooltip
} from "@vapor/v3-components";
import { faTrash } from "@fortawesome/pro-regular-svg-icons/faTrash";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faArrowRight } from "@fortawesome/pro-regular-svg-icons/faArrowRight";

/**
 * @component TargetProductList
 * @description Componente che visualizza la lista dei prodotti proposti nella migrazione,
 * permettendo la rimozione e l'aggiunta di nuovi prodotti.
 */
function TargetProductList({ 
  products, 
  onRemoveProduct,
  onNavigateToCatalog
}) {
  
  // Funzione per formattare i prezzi
  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  // Funzione per tradurre le categorie
  const translateCategory = (category) => {
    const categories = {
      'enterprise': 'Enterprise',
      'professional': 'Professional',
      'hr': 'HR',
      'cross': 'Cross'
    };
    return categories[category] || category || 'N/A';
  };
  
  // Funzione per determinare il tipo di tag in base alla categoria
  const getCategoryTagType = (category) => {
    const categoryMap = {
      'enterprise': 'tone1',
      'professional': 'tone3',
      'hr': 'tone5',
      'cross': 'tone7'
    };
    return categoryMap[category] || 'tone1';
  };

  return (
    <Box>
      <Box sx={{ 
        mb: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Nuovi Prodotti ({products.length})
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<VaporIcon icon={faPlus} />}
          onClick={onNavigateToCatalog}
        >
          Aggiungi
        </Button>
      </Box>
      
      {products.length === 0 ? (
        <Box sx={{ 
          p: 3, 
          textAlign: 'center', 
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px dashed',
          borderColor: 'divider'
        }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Nessun prodotto proposto. Aggiungi prodotti dal catalogo.
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<VaporIcon icon={faPlus} />}
            onClick={onNavigateToCatalog}
            sx={{ mt: 1 }}
          >
            Aggiungi dal catalogo
          </Button>
        </Box>
      ) : (
        <Box sx={{ maxHeight: '600px', overflow: 'auto' }}>
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} key={product.id}>
                <Card sx={{ 
                  boxShadow: 1,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle1" component="h3" fontWeight="bold">
                        {product.name}
                      </Typography>
                      {product.category && (
                        <Tag 
                          label={translateCategory(product.category)} 
                          type={getCategoryTagType(product.category)}
                          size="small"
                          variant="duotone"
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                      {product.description || 'Nessuna descrizione disponibile'}
                    </Typography>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    {/* Informazioni sul Rate Plan */}
                    {product.ratePlan && (
                      <Box sx={{ my: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          Piano: {product.ratePlan.name}
                        </Typography>
                      </Box>
                    )}
                    
                    {product.replacesProductId && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        backgroundColor: 'action.hover',
                        p: 1,
                        borderRadius: 1,
                        mt: 1
                      }}>
                        <VaporIcon icon={faArrowRight} size="sm" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Sostituisce un prodotto precedente
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 2
                    }}>
                      <Typography variant="body1" fontWeight="bold">
                        {formatPrice(product.price * (product.quantity || 1))}/anno
                      </Typography>
                      
                      <Tooltip title="Rimuovi prodotto">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => onRemoveProduct(product.id)}
                        >
                          <VaporIcon icon={faTrash} size="lg" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default TargetProductList;