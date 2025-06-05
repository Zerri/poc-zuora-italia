// client/src/components/LoadingSpinner.jsx
import React from 'react';
import { CircularProgress, Box } from "@vapor/v3-components";

/**
 * @component LoadingSpinner
 * @description Componente di loading riutilizzabile per il code splitting
 */
function LoadingSpinner({ size = 40, text = "Caricamento..." }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: 2,
      py: 4
    }}>
      <CircularProgress size={size} />
      <span style={{ fontSize: '14px', color: '#666' }}>{text}</span>
    </Box>
  );
}

export default LoadingSpinner;