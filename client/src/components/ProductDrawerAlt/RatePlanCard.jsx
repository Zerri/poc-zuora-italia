// File: client/src/components/ProductDrawerAlt/RatePlanCard.jsx
import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  VaporIcon
} from "@vapor/v3-components";

/**
 * @component RatePlanCard
 * @description Card per visualizzare un singolo rate plan
 */
function RatePlanCard({ ratePlan, isSelected, onClick }) {
  // Determina il periodo di fatturazione dalle charges
  const getBillingInfo = () => {
    if (!ratePlan.productRatePlanCharges || ratePlan.productRatePlanCharges.length === 0) {
      return { period: '', timing: '' };
    }
    
    // Cerca la prima charge ricorrente per ottenere le informazioni di billing
    const recurringCharge = ratePlan.productRatePlanCharges.find(c => c.type === 'Recurring');
    if (!recurringCharge) {
      return { period: '', timing: '' };
    }
    
    return {
      period: recurringCharge.billingPeriod || '',
      timing: recurringCharge.billingTiming || '',
      alignment: recurringCharge.billingPeriodAlignment || ''
    };
  };
  
  // Traduce i termini di billing in italiano
  const translateBillingTerm = (term, type) => {
    if (type === 'period') {
      const periodMap = {
        'Annual': 'Annuale',
        'Monthly': 'Mensile',
        'Quarterly': 'Trimestrale',
        'Semiannual': 'Semestrale'
      };
      return periodMap[term] || term;
    }
    
    if (type === 'timing') {
      const timingMap = {
        'IN_ADVANCE': 'Anticipata',
        'IN_ARREARS': 'Posticipata'
      };
      return timingMap[term] || term;
    }
    
    return term;
  };
  
  const billingInfo = getBillingInfo();
  
  // Determina il tipo di charge
  const hasRecurringCharges = ratePlan.productRatePlanCharges?.some(c => c.type === 'Recurring');
  const hasOneTimeCharges = ratePlan.productRatePlanCharges?.some(c => c.type === 'OneTime');
  
  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'grey.300',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 1
        },
        opacity: ratePlan.status === 'Expired' ? 0.7 : 1,
      }}
      onClick={onClick}
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
              borderColor: isSelected ? 'primary.main' : 'grey.400',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 0.5
            }}
          >
            {isSelected && (
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
              
              {/* NUOVA INFO: Billing period */}
              {billingInfo.period && (
                <Chip 
                  label={translateBillingTerm(billingInfo.period, 'period')}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
              
              {/* NUOVA INFO: Billing timing */}
              {billingInfo.timing && (
                <Chip 
                  label={translateBillingTerm(billingInfo.timing, 'timing')}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
            
            {/* Informazioni sui charges */}
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {/* Indicatori di tipo di charge */}
              {hasRecurringCharges && (
                <Chip 
                  label="Ricorrente"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
              
              {hasOneTimeCharges && (
                <Chip 
                  label="Una Tantum"
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
              
              {ratePlan.productRatePlanCharges?.slice(0, 2).map((charge, idx) => (
                <Chip 
                  key={idx}
                  label={charge.name}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              {ratePlan.productRatePlanCharges?.length > 2 && (
                <Chip 
                  label={`+${ratePlan.productRatePlanCharges.length - 2}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
          </Box>
          
          {/* Checkmark se selezionato */}
          {isSelected && (
            <Box sx={{ color: 'primary.main' }}>
              <VaporIcon icon="fa-check" size="lg" />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default RatePlanCard;