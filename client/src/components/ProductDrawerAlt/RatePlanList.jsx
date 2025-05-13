// File: client/src/components/ProductDrawer/RatePlanList.jsx
import React from 'react';
import { Box } from "@vapor/v3-components";
import RatePlanCard from './RatePlanCard';

/**
 * @component RatePlanList
 * @description Lista di rate plan filtrati per tecnologia
 */
function RatePlanList({ 
  ratePlanGroups, 
  technologies, 
  selectedTech,
  selectedRatePlanId, 
  showExpiredPlans, 
  onRatePlanSelect 
}) {
  return (
    <Box sx={{ mb: 3 }}>
      {technologies.map((tech) => {
        if (tech !== selectedTech) return null;
        
        // Filtra i piani per lo stato expired se necessario
        const filteredRatePlans = ratePlanGroups[tech].filter(ratePlan => {
          if (!showExpiredPlans && ratePlan.status === 'Expired') return false;
          return true;
        });
        
        return (
          <Box key={tech}>
            {filteredRatePlans.length > 0 ? (
              filteredRatePlans.map((ratePlan) => (
                <RatePlanCard
                  key={ratePlan.id}
                  ratePlan={ratePlan}
                  isSelected={selectedRatePlanId === ratePlan.id}
                  onClick={() => onRatePlanSelect(ratePlan.id)}
                />
              ))
            ) : (
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.paper', 
                border: '1px dashed', 
                borderColor: 'grey.300',
                borderRadius: 1,
                textAlign: 'center'
              }}>
                Nessun piano disponibile con i filtri selezionati.
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default RatePlanList;