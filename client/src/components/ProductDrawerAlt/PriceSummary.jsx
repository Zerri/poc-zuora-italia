// client/src/components/ProductDrawerAlt/PriceSummary.jsx
import React from 'react';
import {
  Typography,
  Box,
  Paper
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
  
  // Determina il numero di PDL selezionato
  const pdlCharge = recurringCharges.find(c => c.uom === 'Pdl');
  const pdlValue = pdlCharge && chargeValues[pdlCharge.id] ? 
    chargeValues[pdlCharge.id] : '5'; // Default a 5 PDL
  const pdlCount = parseInt(pdlValue, 10);
  
  // Calcolo dei totali
  const annualTotal = recurringCharges.reduce((acc, charge) => {
    return acc + calculateChargeTotal(charge);
  }, 0);
  
  const licenseTotal = onetimeCharges.reduce((acc, charge) => {
    return acc + calculateChargeTotal(charge);
  }, 0);
  
  const firstYearTotal = annualTotal + licenseTotal;
  
  // Calcolo costi per PDL
  const costPerPdl = pdlCount ? (annualTotal / pdlCount) : 0;
  const onetimePerPdl = pdlCount && hasLicense ? (licenseTotal / pdlCount) : 0;
  
  // Formattazione
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 3
    }).format(value);
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
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Riepilogo Prezzi
      </Typography>
      
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
            Canone annuale ({pdlCount} PDL)
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {formatCurrency(annualTotal)}
          </Typography>
        </Box>
        
        {hasLicense && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 1,
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Typography variant="body1">
              Licenza una tantum ({pdlCount} PDL)
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
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 1,
          color: 'text.secondary'
        }}>
          <Typography variant="body2">
            Canone annuale dal secondo anno
          </Typography>
          <Typography variant="body2">
            {formatCurrency(annualTotal)}
          </Typography>
        </Box>
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
          Costo per PDL (media)
        </Typography>
        <Typography variant="body2">
          {formatCurrency(costPerPdl)} / anno
          {hasLicense && ` + ${formatCurrency(onetimePerPdl)} una tantum`}
        </Typography>
      </Box>
    </Paper>
  );
}

export default PriceSummary;