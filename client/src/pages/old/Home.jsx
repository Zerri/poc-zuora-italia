// File: client/src/pages/Home.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import StatsPanel from '../../components/StatsPanel'

// Componente che gestisce la logica dell'applicazione
function Home() {
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'Subscription',
    price: 0,
    inStock: true,
    rating: 5
  })
  
  // URL base del backend (configurato per ambiente di sviluppo)
  const API_URL = import.meta.env.VITE_API_URL || '/api'

  // Accesso al queryClient per invalidare le query
  const queryClient = useQueryClient()

  // Query per ottenere gli items
  const { 
    data: items = [], 
    isLoading, 
    error 
  } = useQuery({ 
    queryKey: ['items'], 
    queryFn: async () => {
      const response = await fetch(`${API_URL}/items`)
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      return response.json()
    }
  })

  // Mutation per creare un nuovo item
  const createItemMutation = useMutation({
    mutationFn: async (newItem) => {
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalida e ricarica la query degli items e delle statistiche dopo una creazione
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      // Reset del form
      setNewItem({
        name: '',
        description: '',
        category: 'Subscription',
        price: 0,
        inStock: true,
        rating: 5
      })
    }
  })

  // Gestisce l'invio del form per creare un nuovo item
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newItem.name) return
    
    createItemMutation.mutate(newItem)
  }

  return (
    <div className="app-container">
      <h1>Zuora POC</h1>
      
      {/* Pannello delle statistiche */}
      <StatsPanel />
      
      {/* Form per aggiungere items */}
      <div className="form-container">
        <h2>Aggiungi nuovo item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descrizione:</label>
            <textarea
              id="description"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Categoria:</label>
            <select
              id="category"
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            >
              <option value="Subscription">Abbonamento</option>
              <option value="Service">Servizio</option>
              <option value="Add-on">Add-on</option>
              <option value="License">Licenza</option>
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="price">Prezzo ($):</label>
              <input
                type="number"
                id="price"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
              />
            </div>
            
            <div className="form-group half">
              <label htmlFor="rating">Valutazione:</label>
              <input
                type="number"
                id="rating"
                min="0"
                max="5"
                step="0.1"
                value={newItem.rating}
                onChange={(e) => setNewItem({...newItem, rating: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="inStock"
              checked={newItem.inStock}
              onChange={(e) => setNewItem({...newItem, inStock: e.target.checked})}
            />
            <label htmlFor="inStock">Disponibile</label>
          </div>
          
          <button 
            type="submit" 
            disabled={createItemMutation.isPending}
          >
            {createItemMutation.isPending ? 'Salvataggio...' : 'Salva'}
          </button>
        </form>
        {createItemMutation.isError && (
          <p className="error">
            Errore: {createItemMutation.error.message}
          </p>
        )}
      </div>

      {/* Visualizzazione degli items */}
      <div className="items-container">
        <h2>Items</h2>
        {isLoading && <p>Caricamento in corso...</p>}
        {error && <p className="error">Errore: {error.message}</p>}
        
        {items.length === 0 && !isLoading ? (
          <p>Nessun item trovato. Aggiungine uno!</p>
        ) : (
          <ul className="items-list">
            {items.map((item) => (
              <li key={item._id} className="item-card">
                <div className="item-header">
                  <h3>{item.name}</h3>
                  {item.inStock ? <span className="tag in-stock">Disponibile</span> : <span className="tag out-of-stock">Non disponibile</span>}
                </div>
                <p className="description">{item.description}</p>
                <div className="item-details">
                  <div className="category">Categoria: <span>{item.category || 'N/A'}</span></div>
                  <div className="price">Prezzo: <span>${item.price ? item.price.toFixed(2) : 'N/A'}</span></div>
                  {item.rating && (
                    <div className="rating">
                      Valutazione: <span className="stars">{item.rating.toFixed(1)} ★</span>
                    </div>
                  )}
                </div>
                <small>Creato il: {new Date(item.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Home