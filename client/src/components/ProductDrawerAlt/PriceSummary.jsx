// client/src/components/ProductDrawerAlt/PriceSummary.jsx
import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Divider,
  Chip
} from "@vapor/v3-components";

function PriceSummary({ 
  selectedRatePlan, 
  chargeValues, 
  calculateChargeTotal 
}) {
  if (!selectedRatePlan) return null;
  
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
  
  // Calcolo dei totali
  const annualTotal = recurringCharges.reduce((acc, charge) => {
    return acc + calculateChargeTotal(charge);
  }, 0);
  
  const licenseTotal = onetimeCharges.reduce((acc, charge) => {
    return acc + calculateChargeTotal(charge);
  }, 0);
  
  const firstYearTotal = annualTotal + licenseTotal;
  
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
      maximumFractionDigits: 3
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
        
        {/* Aggiunta: Mostra il periodo di fatturazione come chip */}
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
            Canone {translateBillingPeriod(billingPeriod).toLowerCase()} ({unitCount} {unitLabel})
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
              Licenza una tantum ({unitCount} {unitLabel})
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
            Totale primo anno
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {formatCurrency(firstYearTotal)}
          </Typography>
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