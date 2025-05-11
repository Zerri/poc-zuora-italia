// Sostituisci questo blocco nel tuo ProductDrawer.jsx

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
  Chip,
  Grid,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";
import ProductInfoSection from './ProductInfoSection';

function ProductDrawer({ open, onClose, product, translateCategory, onAddToOffer }) {
  const [selectedProductRatePlan, setSelectedProductRatePlan] = useState('');
  const [chargeValues, setChargeValues] = useState({});
  const [showExpiredPlans, setShowExpiredPlans] = useState(false);

  // Gruppa i rate plan per tecnologia usando il campo Infrastructure__c
  const groupRatePlansByTechnology = () => {
    if (!product?.productRatePlans) return {};
    
    const grouped = product.productRatePlans.reduce((acc, ratePlan) => {
      // Usa il campo Infrastructure__c se disponibile, altrimenti fallback al nome
      let technology = ratePlan.Infrastructure__c || 'Other';
      
      if (!acc[technology]) {
        acc[technology] = [];
      }
      
      acc[technology].push(ratePlan);
      return acc;
    }, {});
    
    return grouped;
  };
  
  const ratePlanGroups = groupRatePlansByTechnology();
  const technologies = Object.keys(ratePlanGroups);
  
  // Funzione per tradurre il nome della tecnologia per la UI
  const getTechnologyDisplayName = (tech) => {
    const displayNames = {
      'IAAS': 'IAAS',
      'On Premise': 'On Premise',
      'SAAS': 'SAAS',
      'Other': 'Altro'
    };
    return displayNames[tech] || tech;
  };
  
  // Funzione per verificare se un rate plan è selezionato
  const isTechnologySelected = (tech) => {
    return selectedProductRatePlan && 
      product.productRatePlans.find(rp => rp.id === selectedProductRatePlan)?.Infrastructure__c === tech;
  };

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
      width="35vw"
      hideBackdrop={false}
      sx={{ "& .MuiDrawer-paperAnchorRight": { marginTop: "48px" } }}
    >
      <Title
        title={product.name}
        description={translateCategory(product.categoria)}
        divider
        rightItems={[
          <IconButton size="small" variant="outlined" onClick={onClose}>
            <VaporIcon icon={faClose} size="xl" />
          </IconButton>
        ]}
      />

      <Box sx={{ p: 4, flex: 1, overflowY: 'auto', mb: 13 }}>
        <ProductInfoSection product={product} translateCategory={translateCategory} />
        
        <Divider sx={{ my: 3 }} />
        
        {/* NUOVO COMPONENTE DI SELEZIONE RATE PLAN */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Infrastruttura
          </Typography>
          
          {/* Toggle buttons per la tecnologia */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {technologies.map((tech) => (
              <Button
                key={tech}
                variant={isTechnologySelected(tech) ? 'contained' : 'outlined'}
                size="medium"
                onClick={() => {
                  // Seleziona automaticamente il primo rate plan di questa tecnologia
                  const firstPlan = ratePlanGroups[tech][0];
                  if (firstPlan) {
                    setSelectedProductRatePlan(firstPlan.id);
                  }
                }}
                sx={{
                  borderRadius: '24px',
                  px: 2,
                }}
              >
                {getTechnologyDisplayName(tech)}
              </Button>
            ))}
          </Box>
          
          {/* Checkbox per mostrare piani scaduti */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showExpiredPlans}
                  onChange={(e) => setShowExpiredPlans(e.target.checked)}
                  name="showExpiredPlans"
                />
              }
              label="Mostra piani scaduti"
            />
          </Box>
          
          {/* Selezione del rate plan specifico */}
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Piano
          </Typography>
          
          {technologies.map((tech) => {
            if (!isTechnologySelected(tech)) return null;
            
            return (
              <Box key={tech} sx={{ mb: 3 }}>
                {ratePlanGroups[tech]
                  .filter(ratePlan => {
                    // Filtra per piani scaduti basandosi sul campo 'status'
                    if (!showExpiredPlans && ratePlan.status === 'Expired') return false;
                    return true;
                  })
                  .map((ratePlan) => (
                    <Card
                      key={ratePlan.id}
                      sx={{
                        mb: 2,
                        cursor: 'pointer',
                        border: selectedProductRatePlan === ratePlan.id ? 2 : 1,
                        borderColor: selectedProductRatePlan === ratePlan.id ? 'primary.main' : 'grey.300',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: 1
                        },
                        // Distintivo visivo per piani scaduti
                        opacity: ratePlan.status === 'Expired' ? 0.7 : 1,
                      }}
                      onClick={() => setSelectedProductRatePlan(ratePlan.id)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          {/* Radio indicator */}
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              border: 2,
                              borderColor: selectedProductRatePlan === ratePlan.id ? 'primary.main' : 'grey.400',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mt: 0.5
                            }}
                          >
                            {selectedProductRatePlan === ratePlan.id && (
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  backgroundColor: 'primary.main'
                                }}
                              />
                            )}
                          </Box>
                          
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="body1" fontWeight="bold">
                                {ratePlan.name}
                              </Typography>
                              {ratePlan.status === 'Expired' && (
                                <Chip 
                                  label="Scaduto"
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {ratePlan.description || 'Soluzione completa con accesso online'}
                            </Typography>
                            
                            {/* Informazioni aggiuntive dal rate plan */}
                            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {ratePlan.ModalitaDiVendita__c && (
                                <Chip 
                                  label={ratePlan.ModalitaDiVendita__c}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              )}
                              {ratePlan.UdM__c && (
                                <Chip 
                                  label={`UdM: ${ratePlan.UdM__c}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              )}
                            </Box>
                            
                            {/* Informazioni sui charges */}
                            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {ratePlan.productRatePlanCharges?.slice(0, 3).map((charge, idx) => (
                                <Chip 
                                  key={idx}
                                  label={charge.name}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              ))}
                              {ratePlan.productRatePlanCharges?.length > 3 && (
                                <Chip 
                                  label={`+${ratePlan.productRatePlanCharges.length - 3}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              )}
                            </Box>
                          </Box>
                          
                          {/* Checkmark se selezionato */}
                          {selectedProductRatePlan === ratePlan.id && (
                            <Box sx={{ color: 'primary.main' }}>
                              <VaporIcon icon="fa-check" size="lg" />
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            );
          })}
        </Box>

        {/* Charges Configuration */}
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