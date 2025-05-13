// File: client/src/components/ProductDrawerAlt/PricingModelInfo.jsx
import React from 'react';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@vapor/v3-components";
import { faCircle } from "@fortawesome/pro-solid-svg-icons/faCircle";
import { VaporIcon } from "@vapor/v3-components";

/**
 * @component PricingModelInfo
 * @description Componente che mostra informazioni sul modello di pricing del prodotto
 */
function PricingModelInfo({ selectedRatePlan }) {
  if (!selectedRatePlan) return null;
  
  // Determina le caratteristiche del modello di pricing
  const getPricingModelInfo = () => {
    const result = {
      unitOfMeasure: selectedRatePlan.UdM__c || '',
      hasTiers: false,
      hasUnitPrice: false,
      isLicenseAndFee: false,
      hasRecurringCharges: false,
      hasOneTimeCharges: false,
      hasVolumeCharges: false,
      tierStructure: [],
      volumeModel: 'standard'
    };
    
    // Verifica il tipo di unità di misura (PDL o Fatture/Invoice)
    result.isPdl = result.unitOfMeasure === 'Pdl';
    result.isInvoice = result.unitOfMeasure === 'Fatture' || result.unitOfMeasure === 'Invoice';
    
    // Verifica la presenza dei vari tipi di charges
    selectedRatePlan.productRatePlanCharges?.forEach(charge => {
      // Verifica se ci sono charges di tipo Volume
      if (charge.model === 'Volume') {
        result.hasVolumeCharges = true;
        result.hasTiers = true;
        
        // Estrai la struttura dei tiers
        if (charge.pricing && charge.pricing.length > 0) {
          const pricing = charge.pricing[0]; // Prende il primo pricing (EUR o USD)
          if (pricing.tiers && pricing.tiers.length > 0) {
            result.tierStructure = pricing.tiers.map(tier => ({
              startingUnit: tier.startingUnit,
              endingUnit: tier.endingUnit,
              price: tier.price,
              priceFormat: tier.priceFormat
            }));
            
            // Determina se i tier sono modello "scaglioni" o "soglie"
            if (pricing.tiers.length > 1) {
              const firstTier = pricing.tiers[0];
              const secondTier = pricing.tiers[1];
              
              // Se il tier successivo parte da 1 unità dopo la fine del precedente,
              // allora è un modello a "scaglioni"
              if (secondTier.startingUnit === firstTier.endingUnit + 1) {
                result.volumeModel = 'scaglioni';
              } else if (secondTier.startingUnit > firstTier.endingUnit) {
                result.volumeModel = 'soglie';
              }
            }
          }
        }
      }
      
      // Verifica se ci sono charges di tipo PerUnit
      if (charge.model === 'PerUnit') {
        result.hasUnitPrice = true;
      }
      
      // Verifica il tipo di charge (OneTime o Recurring)
      if (charge.type === 'OneTime') {
        result.hasOneTimeCharges = true;
      }
      if (charge.type === 'Recurring') {
        result.hasRecurringCharges = true;
      }
    });
    
    // Determina la modalità di vendita
    const salesModel = selectedRatePlan.ModalitaDiVendita__c || '';
    result.isLicenseAndFee = salesModel.toLowerCase().includes('licenza');
    result.isSubscription = salesModel.toLowerCase().includes('subscription');
    result.isVolumiBTB = salesModel.toLowerCase().includes('volumi');
    
    return result;
  };
  
  const pricingInfo = getPricingModelInfo();
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        my: 3, 
        borderRadius: 2,
        bgcolor: '#f0f5ff',
        border: '1px solid #d0e0ff'
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Dettagli modello di prezzo
      </Typography>
      
      <List dense disablePadding>
        {/* Informazione sul modello a scaglioni/soglie per PDL */}
        {pricingInfo.isPdl && pricingInfo.hasVolumeCharges && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>Fino a 30 PDL:</strong> Prezzo a scaglioni (ogni quantità ha un prezzo fisso)
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Informazione sul modello a scaglioni/soglie per Fatture */}
        {pricingInfo.isInvoice && pricingInfo.hasVolumeCharges && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>Modello fatture/anno:</strong> Prezzo a {pricingInfo.volumeModel === 'scaglioni' ? 'scaglioni' : 'soglie'} 
                  {pricingInfo.tierStructure.length > 0 && ` (da ${pricingInfo.tierStructure[0].startingUnit} a ${pricingInfo.tierStructure[pricingInfo.tierStructure.length-1].endingUnit} fatture)`}
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Informazione sul prezzo unitario per PDL */}
        {pricingInfo.isPdl && pricingInfo.hasUnitPrice && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>Oltre 30 PDL:</strong> Prezzo unitario (prezzo fisso base + costo per PDL aggiuntiva)
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Informazione sul tipo di piano */}
        {pricingInfo.isLicenseAndFee && pricingInfo.hasOneTimeCharges && pricingInfo.hasRecurringCharges && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>Tipo piano:</strong> Licenza + Canone (pagamento una tantum + canone ricorrente)
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Informazione sul tipo di piano Subscription */}
        {pricingInfo.isSubscription && pricingInfo.hasRecurringCharges && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>Tipo piano:</strong> Full Subscription (solo canone ricorrente)
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Informazione sul tipo di piano Volumi BTB */}
        {pricingInfo.isVolumiBTB && pricingInfo.hasOneTimeCharges && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>Tipo piano:</strong> Volumi BTB (pagamento una tantum basato sui volumi)
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Unità di misura */}
        <ListItem sx={{ pb: 1 }}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <VaporIcon icon={faCircle} size="xs" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2">
                <strong>Unità di misura:</strong> {pricingInfo.isPdl ? 'PDL (Postazioni Di Lavoro)' : 'Fatture/anno'}
              </Typography>
            }
          />
        </ListItem>
      </List>
    </Paper>
  );
}

export default PricingModelInfo;