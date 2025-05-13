// File: client/src/components/ProductDrawer/TechnologySelector.jsx
import React from 'react';
import { Box, Button } from "@vapor/v3-components";

/**
 * @component TechnologySelector
 * @description Componente per selezionare la tecnologia dei rate plan
 */
function TechnologySelector({ technologies, selectedTech, onSelectTechnology }) {
  const getTechnologyDisplayName = (tech) => {
    const displayNames = {
      'IAAS': 'IAAS',
      'On Premise': 'On Premise',
      'SAAS': 'SAAS',
      'Other': 'Altro'
    };
    return displayNames[tech] || tech;
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
      {technologies.map((tech) => (
        <Button
          key={tech}
          variant={selectedTech === tech ? 'contained' : 'outlined'}
          size="medium"
          onClick={() => onSelectTechnology(tech)}
          sx={{
            borderRadius: '24px',
            px: 2,
          }}
        >
          {getTechnologyDisplayName(tech)}
        </Button>
      ))}
    </Box>
  );
}

export default TechnologySelector;