import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Drawer,
  Title,
  IconButton,
  VaporIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Divider,
  VaporToolbar
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";

/**
 * @component ProductDrawer
 * @description Componente Drawer per visualizzare i dettagli di un prodotto e aggiungere all'offerta
 * @param {Object} props - Proprietà del componente
 * @param {boolean} props.open - Stato del drawer (aperto/chiuso)
 * @param {Function} props.onClose - Funzione di callback per chiudere il drawer
 * @param {Object} props.product - Prodotto selezionato da visualizzare
 * @param {Function} props.translateCategory - Funzione per tradurre la categoria del prodotto
 * @param {Function} props.onAddToOffer - Funzione callback quando si aggiunge il prodotto all'offerta
 */
function ProductDrawer({ open, onClose, product, translateCategory, onAddToOffer }) {
  const [selectedProductRatePlan, setSelectedProductRatePlan] = useState('');
  // Stato per tenere traccia dei valori inseriti per i productRatePlanCharge
  const [chargeValues, setChargeValues] = useState({});
  
  // Resetta la selezione del rate plan e i valori dei charge quando cambia il prodotto
  useEffect(() => {
    if (product && product.productRatePlans && product.productRatePlans.length > 0) {
      const initialRatePlanId = product.productRatePlans[0]?.id || '';
      setSelectedProductRatePlan(initialRatePlanId);
      
      // Inizializza i valori dei charge per il rate plan selezionato
      resetChargeValues(initialRatePlanId);
    }
  }, [product]);

  // Reinizializza i valori dei charge quando cambia il rate plan
  useEffect(() => {
    if (selectedProductRatePlan) {
      resetChargeValues(selectedProductRatePlan);
    }
  }, [selectedProductRatePlan]);

  // Funzione per inizializzare i valori dei charge
  const resetChargeValues = (ratePlanId) => {
    if (!product) return;
    
    const ratePlan = product.productRatePlans.find(rp => rp.id === ratePlanId);
    if (!ratePlan) return;
    
    const initialValues = {};
    ratePlan.productRatePlanCharges.forEach(charge => {
      initialValues[charge.id] = '';
    });
    
    setChargeValues(initialValues);
  };

  // Se non c'è nessun prodotto selezionato, non renderizzare nulla
  if (!product) {
    return null;
  }

  // Trova il rate plan selezionato
  const selectedRatePlan = product.productRatePlans.find(
    ratePlan => ratePlan.id === selectedProductRatePlan
  );

  // Handler per aggiornare il valore di un charge
  const handleChargeValueChange = (chargeId, value) => {
    setChargeValues(prevValues => ({
      ...prevValues,
      [chargeId]: value
    }));
  };

  // Handler per aggiungere all'offerta
  const handleAddToOffer = () => {
    if (onAddToOffer) {
      // Prepara i dati dei charge con i valori inseriti
      const chargesWithValues = selectedRatePlan.productRatePlanCharges.map(charge => ({
        ...charge,
        value: chargeValues[charge.id]
      }));
      
      onAddToOffer({
        product,
        selectedRatePlan: {
          ...selectedRatePlan,
          productRatePlanCharges: chargesWithValues
        }
      });
    }
    onClose();
  };

  // Handler per il cambio del rate plan
  const handleRatePlanChange = (event) => {
    setSelectedProductRatePlan(event.target.value);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      width="30vw"
      hideBackdrop={false}
      sx={{ "& .MuiDrawer-paperAnchorRight": { marginTop: "48px" } }}
    >
      <Title
        title={product.name}
        description={translateCategory(product.categoria)}
        divider
        rightItems={[
          <IconButton size="small" variant='outlined' onClick={onClose}>
            <VaporIcon icon={faClose} size="xl" />
          </IconButton>
        ]}
      />
      
      <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
        <Typography variant="body1" paragraph>
          {product.description || 'Nessuna descrizione disponibile.'}
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>
            Rate Plan
          </InputLabel>
          <Select
            label="Rate Plan"
            onChange={handleRatePlanChange}
            value={selectedProductRatePlan}
          >
            {product.productRatePlans && product.productRatePlans.map((ratePlan, index) => (
              <MenuItem value={ratePlan.id} key={index}>
                {ratePlan.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedRatePlan && selectedRatePlan.productRatePlanCharges.map((charge, index) => (
          <FormControl fullWidth sx={{ mb: 3 }} key={index}>
            <TextField
              label={charge.name}
              value={chargeValues[charge.id] || ''}
              onChange={(e) => handleChargeValueChange(charge.id, e.target.value)}
            />
          </FormControl>
        ))}
      </Box>
      
      <VaporToolbar
        contentRight={[
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={onClose}
          >
            Chiudi
          </Button>,
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<span>+</span>}
            onClick={handleAddToOffer}
          >
            Aggiungi all'offerta
          </Button>
        ]}
        size="medium"
        variant="regular"
        withoutAppBar
      />
    </Drawer>
  );
}

export default ProductDrawer;