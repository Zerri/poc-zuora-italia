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
  VaporToolbar,
  Chip
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";

/**
 * @component ProductDrawer
 * @description Drawer per configurare un prodotto nell'offerta
 */
function ProductDrawer({ open, onClose, product, translateCategory, onAddToOffer, isAddingToQuote }) {
  const [selectedProductRatePlan, setSelectedProductRatePlan] = useState('');
  const [chargeValues, setChargeValues] = useState({});

  useEffect(() => {
    // Se il prodotto è già configurato (ha charges e ratePlan), recupera i valori salvati
    if (product && product.charges && product.ratePlan) {
      setSelectedProductRatePlan(product.ratePlan.id);
      
      // Recupera i valori delle charges
      const savedValues = {};
      product.charges.forEach(charge => {
        savedValues[charge.id] = charge.value.toString();
      });
      setChargeValues(savedValues);
    } else if (product && product.productRatePlans?.length > 0) {
      // Comportamento esistente per un nuovo prodotto
      const initialRatePlanId = product.productRatePlans[0]?.id || '';
      setSelectedProductRatePlan(initialRatePlanId);
      resetChargeValues(initialRatePlanId);
    }
  }, [product]);

  useEffect(() => {
    if (selectedProductRatePlan && !product.charges) {
      resetChargeValues(selectedProductRatePlan);
    }
  }, [selectedProductRatePlan]);

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

  const handleChargeValueChange = (chargeId, value) => {
    setChargeValues(prevValues => ({
      ...prevValues,
      [chargeId]: value
    }));
  };

  const handleAddToOffer = () => {
    if (onAddToOffer) {
      // Determina se stiamo lavorando con un prodotto già configurato o un nuovo prodotto
      let selectedRatePlanData;
      let productRatePlanCharges;
      
      if (product.charges && product.ratePlan) {
        // Prodotto già configurato
        selectedRatePlanData = product.ratePlan;
        productRatePlanCharges = product.charges.map(charge => ({
          ...charge,
          value: chargeValues[charge.id]
        }));
      } else {
        // Nuovo prodotto
        selectedRatePlanData = product.productRatePlans.find(
          ratePlan => ratePlan.id === selectedProductRatePlan
        );
        productRatePlanCharges = selectedRatePlanData.productRatePlanCharges.map(charge => ({
          ...charge,
          value: chargeValues[charge.id]
        }));
      }
      
      onAddToOffer({
        product,
        selectedRatePlan: {
          ...selectedRatePlanData,
          productRatePlanCharges: productRatePlanCharges
        }
      });
    }
    onClose();
  };

  const handleRatePlanChange = (event) => {
    setSelectedProductRatePlan(event.target.value);
  };

  const getChargeTypeLabel = (type) => {
    switch (type) {
      case 'Recurring': return 'Ricorrente';
      case 'OneTime': return 'Una Tantum';
      case 'Usage': return 'A Consumo';
      default: return 'Altro';
    }
  };

  const calculateChargeTotal = (charge) => {
    const value = parseFloat(chargeValues[charge.id] || 0);

    if (charge.model === 'PerUnit') {
      const unitPrice = charge.pricing?.[0]?.price || 0;
      return value * unitPrice;
    }

    if (charge.model === 'Volume') {
      const tiers = charge.pricing?.[0]?.tiers || [];
      if (tiers.length === 0 || value <= 0) return 0;
      const tier = tiers.find(t => value >= t.startingUnit && value <= t.endingUnit);
      return tier ? tier.price : 0;
    }

    if (charge.model === 'FlatFee') {
      return charge.pricing?.[0]?.price || 0;
    }

    return 0;
  };

  const calculateTotal = () => {
    if (!selectedRatePlan) return 0;
    return selectedRatePlan.productRatePlanCharges.reduce((acc, charge) => {
      return acc + calculateChargeTotal(charge);
    }, 0);
  };

  if (!product) return null;

  // Determina quale rate plan mostrare
  let selectedRatePlan;
  let charges;
  
  if (product.charges && product.ratePlan) {
    // Se il prodotto è già configurato, usa i dati salvati
    selectedRatePlan = {
      ...product.ratePlan,
      productRatePlanCharges: product.charges
    };
    charges = product.charges;
  } else {
    // Altrimenti, usa i dati del rate plan selezionato
    selectedRatePlan = product.productRatePlans.find(
      ratePlan => ratePlan.id === selectedProductRatePlan
    );
    charges = selectedRatePlan?.productRatePlanCharges || [];
  }

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
        description={translateCategory(product.category || product.categoria)}
        divider
        rightItems={[
          <IconButton size="small" variant="outlined" onClick={onClose}>
            <VaporIcon icon={faClose} size="xl" />
          </IconButton>
        ]}
      />

      <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
        <Typography variant="body1" paragraph>
          {product.description || 'Nessuna descrizione disponibile.'}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Rate Plan Selection */}
        {product.productRatePlans && product.productRatePlans.length > 0 ? (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Rate Plan</InputLabel>
            <Select
              label="Rate Plan"
              onChange={handleRatePlanChange}
              value={selectedProductRatePlan}
              disabled={!!product.ratePlan} // Disabilita se il prodotto è già configurato
            >
              {product.productRatePlans.map((ratePlan, index) => (
                <MenuItem value={ratePlan.id} key={index}>
                  {ratePlan.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : product.ratePlan ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rate Plan
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {product.ratePlan.name}
            </Typography>
          </Box>
        ) : null}

        {/* Charges Configuration */}
        {charges && charges.map((charge, index) => {
          const model = charge.model;
          const type = charge.type;

          return (
            <Box key={index} sx={{ mb: 4 }}>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2">{charge.name}</Typography>
                <Chip
                  label={getChargeTypeLabel(type)}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>

              {model === 'FlatFee' && (
                <>
                  <Typography variant="body2">
                    Prezzo fisso: €{charge.pricing?.[0]?.price ?? 0}
                  </Typography>
                </>
              )}

              {(model === 'PerUnit' || model === 'Volume') && (
                <>
                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      label="Quantità"
                      value={chargeValues[charge.id] || ''}
                      onChange={(e) => handleChargeValueChange(charge.id, e.target.value)}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </FormControl>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Prezzo unitario: €{charge.pricing?.[0]?.price ?? 'n.d.'}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Prezzo calcolato: €{calculateChargeTotal(charge).toFixed(2)}
                  </Typography>
                </>
              )}

              {model === 'Usage' && (
                <>
                  <Typography variant="body2">
                    Prezzo a consumo: €{charge.pricing?.[0]?.price ?? 0} per {charge.uom || 'unità'}
                  </Typography>
                </>
              )}
            </Box>
          );
        })}
      </Box>

      <Divider />

      <VaporToolbar
        contentLeft={[
          <Typography variant="subtitle1">
            Totale: €{calculateTotal().toFixed(2)}
          </Typography>
        ]}
        contentRight={[
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Chiudi
          </Button>,
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<span>+</span>} 
            onClick={handleAddToOffer}
          >
            {isAddingToQuote ? 'Aggiungi al preventivo' : 'Aggiungi all\'offerta'}
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