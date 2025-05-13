// File: client/src/components/ProductDrawer/ProductDrawer.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography,
  Button,
  Drawer,
  Title,
  IconButton,
  VaporIcon,
  Box,
  Divider,
  VaporToolbar,
  FormControlLabel,
  Checkbox
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";

// Componenti importati
import ProductInfoSection from '../ProductInfoSection';
import TechnologySelector from './TechnologySelector';
import RatePlanList from './RatePlanList';
import ChargeConfigurator from './ChargeConfigurator';

/**
 * @component ProductDrawer
 * @description Drawer per configurare un prodotto nell'offerta (versione refactored)
 */
function ProductDrawer({ open, onClose, product, translateCategory, onAddToOffer }) {
  // State
  const [selectedProductRatePlan, setSelectedProductRatePlan] = useState('');
  const [chargeValues, setChargeValues] = useState({});
  const [showExpiredPlans, setShowExpiredPlans] = useState(false);
  const [selectedTech, setSelectedTech] = useState('');

  // Raggruppamento rate plan per tecnologia
  const ratePlanGroups = useMemo(() => {
    if (!product?.productRatePlans) return {};
    
    return product.productRatePlans.reduce((acc, ratePlan) => {
      let technology = ratePlan.Infrastructure__c || 'Other';
      
      if (!acc[technology]) {
        acc[technology] = [];
      }
      
      acc[technology].push(ratePlan);
      return acc;
    }, {});
  }, [product]);
  
  const technologies = Object.keys(ratePlanGroups);

  // Effetti
  useEffect(() => {
    if (product && product.productRatePlans?.length > 0) {
      const initialRatePlan = product.productRatePlans[0];
      const initialTech = initialRatePlan.Infrastructure__c || 'Other';
      
      setSelectedProductRatePlan(initialRatePlan.id);
      setSelectedTech(initialTech);
      resetChargeValues(initialRatePlan.id);
    }
  }, [product]);

  useEffect(() => {
    if (selectedProductRatePlan) {
      resetChargeValues(selectedProductRatePlan);
    }
  }, [selectedProductRatePlan]);

  // Gestori
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
    if (onAddToOffer && selectedRatePlan) {
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

  const handleSelectTechnology = (tech) => {
    setSelectedTech(tech);
    // Seleziona il primo rate plan per questa tecnologia
    const firstPlan = ratePlanGroups[tech][0];
    if (firstPlan) {
      setSelectedProductRatePlan(firstPlan.id);
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
        
        {/* Sezione di selezione tecnologia e rate plan */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Infrastruttura
          </Typography>
          
          <TechnologySelector 
            technologies={technologies} 
            selectedTech={selectedTech}
            onSelectTechnology={handleSelectTechnology}
          />
          
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
          
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Piano
          </Typography>
          
          <RatePlanList
            ratePlanGroups={ratePlanGroups}
            technologies={technologies}
            selectedTech={selectedTech}
            selectedRatePlanId={selectedProductRatePlan}
            showExpiredPlans={showExpiredPlans}
            onRatePlanSelect={setSelectedProductRatePlan}
          />
        </Box>

        {/* Sezione configurazione charges */}
        {selectedRatePlan && (
          <ChargeConfigurator
            charges={selectedRatePlan.productRatePlanCharges}
            chargeValues={chargeValues}
            onChargeValueChange={handleChargeValueChange}
            calculateChargeTotal={calculateChargeTotal}
          />
        )}
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