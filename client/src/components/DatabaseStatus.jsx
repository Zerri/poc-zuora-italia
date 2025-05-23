// client/src/components/DatabaseStatus.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Chip,
  Typography,
  VaporIcon,
  Tooltip
} from "@vapor/v3-components";
import { faDatabase } from "@fortawesome/pro-regular-svg-icons/faDatabase";
import { faCloud } from "@fortawesome/pro-regular-svg-icons/faCloud";
import { faServer } from "@fortawesome/pro-regular-svg-icons/faServer";

/**
 * @component DatabaseStatus
 * @description Mostra lo stato della connessione al database e informazioni sul tipo di ambiente
 */
function DatabaseStatus() {
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Query per ottenere le informazioni del database
  const { data: dbInfo, isLoading, error } = useQuery({
    queryKey: ['database-info'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/health/database`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    },
    refetchInterval: 30000, // Aggiorna ogni 30 secondi
    staleTime: 10000, // Considera i dati freschi per 10 secondi
  });

  if (isLoading) {
    return (
      <Chip
        label="Verifica DB..."
        color="default"
        size="small"
        variant="outlined"
        icon={<VaporIcon icon={faDatabase} size="sm" />}
      />
    );
  }

  if (error) {
    return (
      <Tooltip title={`Errore connessione DB: ${error.message}`}>
        <Chip
          label="DB Error"
          color="error"
          size="small"
          variant="filled"
          icon={<VaporIcon icon={faDatabase} size="sm" />}
        />
      </Tooltip>
    );
  }

  // Determina il tipo di database e le relative proprietà
  const getDatabaseInfo = () => {
    if (!dbInfo) return { type: 'Unknown', color: 'default', icon: faDatabase };

    const isLocal = dbInfo.host?.includes('localhost') || dbInfo.host?.includes('127.0.0.1');
    const isAzure = dbInfo.host?.includes('cosmos.azure.com') || dbInfo.host?.includes('documents.azure.com');
    const isDocker = dbInfo.connectionString?.includes('admin:password123');

    if (isDocker || isLocal) {
      return {
        type: 'Docker Local',
        color: 'success',
        icon: faServer,
        description: `DB: ${dbInfo.database} | Host: ${dbInfo.host}`
      };
    } else if (isAzure) {
      return {
        type: 'Azure Cosmos',
        color: 'primary',
        icon: faCloud,
        description: `DB: ${dbInfo.database} | Host: ${dbInfo.host}`
      };
    } else {
      return {
        type: 'MongoDB',
        color: 'warning',
        icon: faDatabase,
        description: `DB: ${dbInfo.database} | Host: ${dbInfo.host}`
      };
    }
  };

  const dbStatus = getDatabaseInfo();

  return (
    <Tooltip title={dbStatus.description}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Chip
          label={dbStatus.type}
          color={dbStatus.color}
          size="small"
          variant="filled"
          icon={<VaporIcon icon={dbStatus.icon} size="sm" />}
          sx={{
            fontWeight: 'medium',
            fontSize: '0.75rem'
          }}
        />
      </Box>
    </Tooltip>
  );
}

export default DatabaseStatus;