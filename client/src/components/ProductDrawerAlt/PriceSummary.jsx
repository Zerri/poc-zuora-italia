import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Divider,
  Chip,
  TextField,
  InputAdornment
} from "@vapor/v3-components";

function PriceSummary({ 
  selectedRatePlan, 
  chargeValues, 
  calculateChargeTotal,
  customerPrice: propCustomerPrice, // Rinominato per evitare confusione
  onCustomerPriceChange // Prop per gestire il cambio di prezzo cliente
}) {
  // State locale per il prezzo cliente
  const [customerPrice, setCustomerPrice] = useState('');
  
  // Effetto per aggiornare il prezzo cliente quando cambiano i dati esterni
  useEffect(() => {
    if (selectedRatePlan) {
      const calculatedTotal = calculateTotalPrice();
      
      // FIX: Se il prezzo cliente è già impostato dall'esterno, usalo
      if (propCustomerPrice !== undefined && propCustomerPrice > 0) {
        setCustomerPrice(propCustomerPrice.toFixed(2));
      } else {
        // Altrimenti usa il prezzo calcolato
        setCustomerPrice(calculatedTotal.toFixed(2));
        
        // Notifica il componente genitore del prezzo iniziale
        if (onCustomerPriceChange) {
          onCustomerPriceChange(calculatedTotal);
        }
      }
    }
  }, [selectedRatePlan, chargeValues, propCustomerPrice]);
  
  // Se non abbiamo un rate plan selezionato, mostriamo un messaggio vuoto
  if (!selectedRatePlan) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          my: 3, 
          borderRadius: 2,
          bgcolor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          textAlign: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Seleziona un piano per visualizzare i dettagli di prezzo.
        </Typography>
      </Paper>
    );
  }
  
  // Determina se il rate plan selezionato ha una struttura "Licenza + canone"
  const hasLicense = selectedRatePlan.ModalitaDiVendita__c === 'Licenza + canone';
  
  // Ottiene tutte le charges e le suddivide per tipo
  const recurringCharges = selectedRatePlan.productRatePlanCharges.filter(c => c.type === 'Recurring');
  const onetimeCharges = selectedRatePlan.productRatePlanCharges.filter(c => c.type === 'OneTime');
  
  // Determina il numero di PDL o fatture selezionato
  let unitCharge, unitValue, unitCount, unitLabel;
  
  if (selectedRatePlan.UdM__c === 'Pdl') {
    unitCharge = recurringCharges.find(c => c.uom === 'Pdl');
    unitValue = unitCharge && chargeValues[unitCharge.id] ? 
      chargeValues[unitCharge.id] : '5'; // Default a 5 PDL
    unitCount = parseInt(unitValue, 10);
    unitLabel = 'PDL';
  } else if (selectedRatePlan.UdM__c === 'Fatture' || selectedRatePlan.UdM__c === 'Invoice') {
    unitCharge = recurringCharges.find(c => c.uom === 'Invoice' || c.uom === 'Fatture');
    unitValue = unitCharge && chargeValues[unitCharge.id] ? 
      chargeValues[unitCharge.id] : '500'; // Default a 500 fatture
    unitCount = parseInt(unitValue, 10);
    unitLabel = 'fatture';
  }
  
  // Funzione per calcolare i totali
  const calculateTotalPrice = () => {
    const annualTotal = recurringCharges.reduce((acc, charge) => {
      return acc + calculateChargeTotal(charge);
    }, 0);
    
    const licenseTotal = onetimeCharges.reduce((acc, charge) => {
      return acc + calculateChargeTotal(charge);
    }, 0);
    
    return annualTotal + licenseTotal;
  };
  
  // Calcolo dei totali
  const annualTotal = recurringCharges.reduce((acc, charge) => {
    return acc + calculateChargeTotal(charge);
  }, 0);
  
  const licenseTotal = onetimeCharges.reduce((acc, charge) => {
    return acc + calculateChargeTotal(charge);
  }, 0);
  
  const firstYearTotal = annualTotal + licenseTotal;
  
  // Calcolo dello sconto
  const calculateDiscount = () => {
    const customerPriceValue = parseFloat(customerPrice) || 0;
    if (!customerPriceValue || !firstYearTotal || customerPriceValue >= firstYearTotal) return 0;
    return ((firstYearTotal - customerPriceValue) / firstYearTotal * 100).toFixed(2);
  };
  
  // Gestione del cambio di prezzo cliente
  const handleCustomerPriceChange = (e) => {
    const value = e.target.value;
    setCustomerPrice(value);
    
    // FIX: Notifica il componente genitore con il nuovo valore
    if (onCustomerPriceChange) {
      const numericValue = parseFloat(value) || 0;
      onCustomerPriceChange(numericValue);
      
      // Aggiungi log per debug
      console.log('Customer price changed to:', numericValue);
    }
  };
  
  // Calcolo costi per unità
  const costPerUnit = unitCount ? (annualTotal / unitCount) : 0;
  const onetimePerUnit = unitCount && hasLicense ? (licenseTotal / unitCount) : 0;
  
  // Ottieni la prima charge ricorrente per le informazioni di billing
  const firstRecurringCharge = recurringCharges[0];
  const billingPeriod = firstRecurringCharge?.billingPeriod || 'Annual';
  const billingTiming = firstRecurringCharge?.billingTiming || 'IN_ADVANCE';
  
  // Formattazione
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Traduzione del periodo di billing
  const translateBillingPeriod = (period) => {
    const periodMap = {
      'Annual': 'Annuale',
      'Monthly': 'Mensile',
      'Quarterly': 'Trimestrale',
      'Semiannual': 'Semestrale'
    };
    return periodMap[period] || period;
  };
  
  // Traduzione del timing di billing
  const translateBillingTiming = (timing) => {
    const timingMap = {
      'IN_ADVANCE': 'Anticipata',
      'IN_ARREARS': 'Posticipata'
    };
    return timingMap[timing] || timing;
  };

  // Calcolo sconto attuale
  const discountPercentage = calculateDiscount();

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        my: 3, 
        borderRadius: 2,
        bgcolor: '#f8f9fa',
        border: '1px solid #e0e0e0'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Riepilogo Prezzi
        </Typography>
        
        {/* Mostra il periodo di fatturazione come chip */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={`${translateBillingPeriod(billingPeriod)}`}
            color="primary"
            size="small"
          />
          <Chip 
            label={`${translateBillingTiming(billingTiming)}`}
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>
      
      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
        Dettaglio Prezzi
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 1 
        }}>
          <Typography variant="body1">
            Canone {translateBillingPeriod(billingPeriod).toLowerCase()} {unitCount > 0 && `(${unitCount} ${unitLabel})`}
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {formatCurrency(annualTotal)}
          </Typography>
        </Box>
        
        {hasLicense && licenseTotal > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 1,
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Typography variant="body1">
              Licenza una tantum {unitCount > 0 && `(${unitCount} ${unitLabel})`}
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatCurrency(licenseTotal)}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 2,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="body1" fontWeight="bold">
            Prezzo di listino
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {formatCurrency(firstYearTotal)}
          </Typography>
        </Box>

        {/* Input per prezzo cliente personalizzato */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 2,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="body1" fontWeight="bold">
            Prezzo cliente
            {discountPercentage > 0 && (
              <Chip 
                label={`-${discountPercentage}%`}
                color="success"
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <TextField
            value={customerPrice}
            onChange={handleCustomerPriceChange}
            type="number"
            size="small"
            sx={{ width: '120px' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0, step: 0.01 }
            }}
          />
        </Box>
        
        {hasLicense && licenseTotal > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 1,
            color: 'text.secondary'
          }}>
            <Typography variant="body2">
              Canone {translateBillingPeriod(billingPeriod).toLowerCase()} dal secondo anno
            </Typography>
            <Typography variant="body2">
              {formatCurrency(annualTotal)}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ 
        bgcolor: '#e6f2ff', 
        p: 2, 
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5
      }}>
        <Typography variant="body1" fontWeight="medium">
          Costo per {unitLabel === 'PDL' ? 'PDL' : 'fattura'} (media)
        </Typography>
        <Typography variant="body2">
          {formatCurrency(costPerUnit)} / {billingPeriod === 'Annual' ? 'anno' : billingPeriod.toLowerCase()}
          {hasLicense && onetimePerUnit > 0 && ` + ${formatCurrency(onetimePerUnit)} una tantum`}
        </Typography>
      </Box>
    </Paper>
  );
}

export default PriceSummary;