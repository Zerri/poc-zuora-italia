// File: client/src/components/StatsPanel.jsx
import { useQuery } from '@tanstack/react-query';
import './StatsPanel.css';

function StatsPanel() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }
  });

  if (isLoading) return <div className="stats-panel loading">Caricamento statistiche...</div>;
  
  if (error) return <div className="stats-panel error">Errore: {error.message}</div>;
  
  return (
    <div className="stats-panel">
      <h2>Statistiche Catalogo</h2>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{stats.totalItems}</div>
          <div className="stat-label">Prodotti totali</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.inStockCount}</div>
          <div className="stat-label">Disponibili</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.outOfStockCount}</div>
          <div className="stat-label">Non disponibili</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.avgRating?.toFixed(1)} ★</div>
          <div className="stat-label">Valutazione media</div>
        </div>
      </div>
      
      <div className="categories-section">
        <h3>Categorie</h3>
        <div className="categories-list">
          {stats.categoryCounts?.map((category) => (
            <div key={category._id} className="category-item">
              <div className="category-name">{category._id || 'Non specificata'}</div>
              <div className="category-count">{category.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;