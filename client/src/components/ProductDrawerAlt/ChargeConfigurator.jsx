// File: client/src/components/ProductDrawer/ChargeConfigurator.jsx
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

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Configurazione
      </Typography>
      
      {charges.map((charge, index) => {
        const model = charge.model;
        const type = charge.type;

        return (
          <Box key={index} sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
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
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="medium">
                  Prezzo fisso: €{charge.pricing?.[0]?.price ?? 0}
                </Typography>
              </Box>
            )}

            {(model === 'PerUnit' || model === 'Volume') && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    type="number"
                    label="Quantità"
                    value={chargeValues[charge.id] || ''}
                    onChange={(e) => onChargeValueChange(charge.id, e.target.value)}
                    InputProps={{ inputProps: { min: 0 } }}
                    size="small"
                  />
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Prezzo unitario: €{charge.pricing?.[0]?.price ?? 'n.d.'}
                  </Typography>

                  <Typography variant="body2" fontWeight="medium">
                    Prezzo calcolato: €{calculateChargeTotal(charge).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}

            {model === 'Usage' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Prezzo a consumo: €{charge.pricing?.[0]?.price ?? 0} per {charge.uom || 'unità'}
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