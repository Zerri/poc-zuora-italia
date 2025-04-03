// File: client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Vapor from './pages/Vapor';
import './App.css';

// Crea un client di query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/vapor" element={<Vapor />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;