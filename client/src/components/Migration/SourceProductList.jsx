// client/src/components/migration/SourceProductList.jsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Tag,
  Chip,
  Grid,
  Tooltip,
  VaporIcon,
  Badge
} from "@vapor/v3-components";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faInfoCircle } from "@fortawesome/pro-solid-svg-icons/faInfoCircle";
import { faArrowRightArrowLeft } from "@fortawesome/pro-solid-svg-icons/faArrowRightArrowLeft";

/**
 * @component SourceProductList
 * @description Componente che visualizza la lista dei prodotti originali nella migrazione,
 * evidenziando quelli che non possono essere migrati.
 */
function SourceProductList({ 
  products, 
  nonMigrableProductIds,
  nonMigrableReasons = {},
  replacementMap = {} // Mappa che indica quale prodotto di destinazione sostituisce quale prodotto di origine
}) {
  
  // Funzione per determinare se un prodotto può essere migrato
  const isProductMigratable = (productId) => {
    return !nonMigrableProductIds.includes(productId);
  };
  
  // Funzione per ottenere il motivo della non migrabilità
  const getNonMigratableReason = (productId) => {
    return nonMigrableReasons[productId] || "Questo prodotto non può essere migrato";
  };
  
  // Funzione per verificare se un prodotto ha un sostituto
  const hasReplacement = (productId) => {
    return !!replacementMap[productId];
  };
  
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

  // Conta i prodotti migrabili e non migrabili
  const migrableCount = products.filter(p => isProductMigratable(p.id)).length;
  const nonMigrableCount = products.length - migrableCount;

  return (
    <Box>
      <Box sx={{ 
        mb: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Prodotti Attuali ({products.length})
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`Non Migrabili (${nonMigrableCount})`}
            color="error"
            variant="outlined"
            size="small"
            icon={<VaporIcon icon={faExclamationTriangle} size="sm" />}
          />
          <Chip
            label={`Migrabili (${migrableCount})`}
            color="success"
            variant="outlined"
            size="small"
          />
        </Box>
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
          <Typography variant="body2" color="text.secondary">
            Nessun prodotto presente nella sottoscrizione attuale
          </Typography>
        </Box>
      ) : (
        <Box sx={{ maxHeight: '600px', overflow: 'auto' }}>
          <Grid container spacing={2}>
            {products.map((product) => {
              const migratable = isProductMigratable(product.id);
              const hasProductReplacement = hasReplacement(product.id);
              
              return (
                <Grid item xs={12} key={product.id}>
                  <Card sx={{ 
                    boxShadow: 1,
                    opacity: migratable ? 1 : 0.8,
                    border: migratable ? '1px solid transparent' : '1px solid',
                    borderColor: migratable ? 'transparent' : 'error.light',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: migratable ? 'translateY(-3px)' : 'none',
                      boxShadow: migratable ? 2 : 1
                    }
                  }}>
                    {migratable && hasProductReplacement && (
                      <Box sx={{
                        position: 'absolute',
                        top: -8,
                        right: 8,
                        zIndex: 10
                      }}>
                        <Tooltip title="Questo prodotto verrà sostituito con una versione più recente">
                          <Chip
                            label="Con sostituto"
                            color="primary"
                            size="small"
                            icon={<VaporIcon icon={faArrowRightArrowLeft} size="sm" />}
                          />
                        </Tooltip>
                      </Box>
                    )}
                    
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
                          {product.ratePlan.Infrastructure__c && (
                            <Typography variant="body2" color="text.secondary">
                              Infrastruttura: {product.ratePlan.Infrastructure__c}
                            </Typography>
                          )}
                        </Box>
                      )}
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Tooltip 
                            title={migratable ? "Questo prodotto può essere migrato" : getNonMigratableReason(product.id)}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              bgcolor: migratable ? 'success.light' : 'error.light',
                              p: '4px 8px',
                              borderRadius: '4px'
                            }}>
                              <VaporIcon 
                                icon={migratable ? faInfoCircle : faExclamationTriangle} 
                                size="sm" 
                                color={migratable ? "success" : "error"} 
                              />
                              <Typography 
                                variant="caption" 
                                color={migratable ? "success.dark" : "error.dark"}
                                sx={{ ml: 0.5 }}
                              >
                                {migratable ? "Migrabile" : "Non migrabile"}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </Box>
                        
                        <Typography variant="body1" fontWeight="bold">
                          {formatPrice(product.price * (product.quantity || 1))}/anno
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default SourceProductList;