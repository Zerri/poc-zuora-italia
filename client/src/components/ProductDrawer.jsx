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
    if (product && product.productRatePlans?.length > 0) {
      const initialRatePlanId = product.productRatePlans[0]?.id || '';
      setSelectedProductRatePlan(initialRatePlanId);
      resetChargeValues(initialRatePlanId);
    }
  }, [product]);

  useEffect(() => {
    if (selectedProductRatePlan) {
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

  const selectedRatePlan = product.productRatePlans.find(
    ratePlan => ratePlan.id === selectedProductRatePlan
  );

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
        description={translateCategory(product.category)}
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

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Rate Plan</InputLabel>
          <Select
            label="Rate Plan"
            onChange={handleRatePlanChange}
            value={selectedProductRatePlan}
          >
            {product.productRatePlans?.map((ratePlan, index) => (
              <MenuItem value={ratePlan.id} key={index}>
                {ratePlan.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedRatePlan && selectedRatePlan.productRatePlanCharges.map((charge, index) => {
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
          <Button variant="contained" color="primary" startIcon={<span>+</span>} onClick={handleAddToOffer}>
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
