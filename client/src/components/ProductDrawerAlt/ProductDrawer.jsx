// File: client/src/components/ProductDrawerAlt/ProductDrawer.jsx
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
import PriceSummary from './PriceSummary';
import PricingModelInfo from './PricingModelInfo';

/**
 * @component ProductDrawer
 * @description Drawer per configurare un prodotto nell'offerta (versione refactored)
 */
function ProductDrawer({ open, onClose, product, translateCategory, onAddToOffer, isAddingToQuote = false }) {
  // State
  const [selectedProductRatePlan, setSelectedProductRatePlan] = useState('');
  const [chargeValues, setChargeValues] = useState({});
  const [showExpiredPlans, setShowExpiredPlans] = useState(false);
  const [selectedTech, setSelectedTech] = useState('');
  // NUOVO: State per il prezzo cliente personalizzato
  const [customerPrice, setCustomerPrice] = useState(0);

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

  // MODIFICATO: Gestiamo anche il prezzo cliente personalizzato
  const handleAddToOffer = () => {
    if (onAddToOffer && selectedRatePlan) {
      const chargesWithValues = selectedRatePlan.productRatePlanCharges.map(charge => ({
        ...charge,
        value: chargeValues[charge.id]
      }));
      
      // Calcola il prezzo totale di listino
      const listPrice = calculateTotal();
      
      // Se il prezzo cliente non è stato impostato o è zero, usa il prezzo di listino
      const finalCustomerPrice = (customerPrice && customerPrice > 0) ? customerPrice : listPrice;
      
      onAddToOffer({
        product,
        selectedRatePlan: {
          ...selectedRatePlan,
          productRatePlanCharges: chargesWithValues
        },
        // NUOVO: Aggiungiamo il prezzo cliente personalizzato
        customerPrice: finalCustomerPrice
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
  
  // NUOVO: Funzione per gestire il cambio del prezzo cliente
  const handleCustomerPriceChange = (price) => {
    setCustomerPrice(price);
  };

  const calculateChargeTotal = (charge) => {
    if (!charge) return 0;
    
    // Per charges di tipo Volume cerca la fascia corrispondente alla quantità
    if (charge.model === 'Volume') {
      const quantity = parseInt(chargeValues[charge.id] || '0', 10);
      if (!quantity) return 0;
      
      // Cerca la fascia di prezzo corrispondente (pricing[1] è EUR)
      const tier = charge.pricing?.[1]?.tiers?.find(t => 
        quantity >= t.startingUnit && quantity <= t.endingUnit
      );
      
      if (tier) {
        return tier.price;
      }
      
      return 0;
    }
    
    // Per PerUnit moltiplica prezzo unitario per quantità
    if (charge.model === 'PerUnit') {
      const value = parseFloat(chargeValues[charge.id] || 0);
      const unitPrice = charge.pricing?.[1]?.price || 0; // [1] per EUR
      return value * unitPrice;
    }
    
    // Per FlatFee ritorna il prezzo fisso
    if (charge.model === 'FlatFee') {
      return charge.pricing?.[1]?.price || 0; // [1] per EUR
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

        {/* Sezione informazioni sul modello di prezzo */}
        {selectedRatePlan && (
          <PricingModelInfo selectedRatePlan={selectedRatePlan} />
        )}

        {/* Sezione configurazione charges */}
        {selectedRatePlan && (
          <ChargeConfigurator
            charges={selectedRatePlan.productRatePlanCharges}
            chargeValues={chargeValues}
            onChargeValueChange={handleChargeValueChange}
            calculateChargeTotal={calculateChargeTotal}
          />
        )}

        {/* Sezione riepilogo prezzi - MODIFICATA per supportare prezzo cliente */}
        {selectedRatePlan && (
          <PriceSummary
            selectedRatePlan={selectedRatePlan}
            chargeValues={chargeValues}
            calculateChargeTotal={calculateChargeTotal}
            onCustomerPriceChange={handleCustomerPriceChange}
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