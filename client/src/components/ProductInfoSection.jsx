import React from 'react';
import {
  Typography,
  Grid,
  Box
} from "@vapor/v3-components";

/**
 * @component ProductInfoSection
 * @description Sezione per visualizzare le informazioni del prodotto con nuovo ordine
 */
function ProductInfoSection({ product, translateCategory }) {
  // Determina il tipo di prodotto
  const getProductType = (product) => {
    if (product.type) return product.type;
    if (product.categoria === 'enterprise') return 'Enterprise';
    if (product.categoria === 'professional') return 'Professionale';
    return 'Commerciale';
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {/* Prima riga: Nome */}
        <Grid item xs={12}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            Nome
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {product.name}
          </Typography>
        </Grid>

        {/* Seconda riga: Descrizione */}
        <Grid item xs={12}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            Descrizione
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {product.description || 'Nessuna descrizione disponibile'}
          </Typography>
        </Grid>

        {/* Terza riga: SKU, Categoria, Tipo */}
        <Grid item xs={4}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            SKU
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {product.sku || product.id || 'SKU-00000003'}
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            Categoria
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {translateCategory(product.categoria) || 'Base Products'}
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            Tipo
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {getProductType(product)}
          </Typography>
        </Grid>

        {/* Quarta riga: Validità */}
        <Grid item xs={12}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            Validità
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            2024-02-01 - 2030-02-01
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductInfoSection;