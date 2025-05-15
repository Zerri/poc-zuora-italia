// client/src/context/UserRoleContext.jsx - versione aggiornata
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Creazione del context
const UserRoleContext = createContext();

/**
 * Provider per il ruolo utente selezionato
 * Questo componente memorizza e fornisce l'accesso al ruolo utente corrente
 * e invalida automaticamente le query pertinenti quando il ruolo cambia
 */
export function UserRoleProvider({ children }) {
  const [userRole, setUserRole] = useState('admin'); // Valore predefinito
  const queryClient = useQueryClient(); // Accesso al query client di React Query
  
  // Effetto per invalidare le query quando cambia il ruolo utente
  useEffect(() => {
    // Invalida la query dei prodotti quando cambia il ruolo
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [userRole, queryClient]);
  
  // Funzione personalizzata per cambiare il ruolo e invalidare le query pertinenti
  const changeUserRole = (newRole) => {
    // Imposta il nuovo ruolo
    setUserRole(newRole);
    
    // Forza l'invalidazione immediata delle query pertinenti
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole: changeUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

/**
 * Hook personalizzato per accedere facilmente al context
 */
export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole deve essere utilizzato all\'interno di un UserRoleProvider');
  }
  return context;
}