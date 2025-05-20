import React from 'react';
import {
  Typography,
  Box,
  Chip,
  FormControl,
  TextField
} from "@vapor/v3-components";

/**
 * @component ChargeConfigurator
 * @description Componente per configurare i valori delle charge di un rate plan
 */
function ChargeConfigurator({ charges, chargeValues, onChargeValueChange, calculateChargeTotal }) {
  const getChargeTypeLabel = (type) => {
    switch (type) {
      case 'Recurring': return 'Ricorrente';
      case 'OneTime': return 'Una Tantum';
      case 'Usage': return 'A Consumo';
      default: return 'Altro';
    }
  };

  if (!charges || charges.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        Nessuna configurazione disponibile per questo piano.
      </Box>
    );
  }

  // Formattazione valuta
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Configurazione
      </Typography>
      
      {charges.map((charge, index) => {
        const model = charge.model;
        const type = charge.type;
        const calculatedPrice = calculateChargeTotal(charge);

        // FIX: Determina il valore corrente per questo charge
        const currentValue = chargeValues[charge.id] || '';

        return (
          <Box key={index} sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle2">{charge.name}</Typography>
                <Chip
                  label={getChargeTypeLabel(type)}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>
              {/* FIX: Mostra sempre il prezzo calcolato, anche per FlatFee */}
              {calculatedPrice > 0 && (
                <Typography variant="subtitle2" fontWeight="bold">
                  {formatCurrency(calculatedPrice)}
                </Typography>
              )}
            </Box>

            {model === 'FlatFee' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="medium">
                  Prezzo fisso: {formatCurrency(charge.pricing?.[0]?.price ?? 0)}
                </Typography>
              </Box>
            )}

            {(model === 'PerUnit' || model === 'Volume') && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    type="number"
                    label="Quantità"
                    value={currentValue}
                    onChange={(e) => onChargeValueChange(charge.id, e.target.value)}
                    InputProps={{ 
                      inputProps: { min: 0 },
                      // FIX: Aggiungi un suffisso per mostrare l'unità di misura
                      endAdornment: charge.uom ? <Typography variant="body2" sx={{ ml: 1 }}>{charge.uom}</Typography> : null
                    }}
                    size="small"
                  />
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    {model === 'PerUnit' ? (
                      <>Prezzo unitario: {formatCurrency(charge.pricing?.[0]?.price ?? 0)}</>
                    ) : (
                      <>Prezzo basato sulla fascia di volume</>
                    )}
                  </Typography>
                </Box>
                
                {/* FIX: Aggiungi una spiegazione per i modelli di prezzo Volume */}
                {model === 'Volume' && charge.pricing?.[0]?.tiers?.length > 0 && (
                  <Box sx={{ mt: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                      Fasce di prezzo:
                    </Typography>
                    {charge.pricing[0].tiers.map((tier, idx) => (
                      <Typography key={idx} variant="caption" display="block">
                        {tier.startingUnit} - {tier.endingUnit || '∞'}: {formatCurrency(tier.price)}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {model === 'Usage' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Prezzo a consumo: {formatCurrency(charge.pricing?.[0]?.price ?? 0)} per {charge.uom || 'unità'}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default ChargeConfigurator;