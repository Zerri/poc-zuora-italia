// File: client/src/components/Navbar.jsx
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <NavLink to="/">Zuora POC</NavLink>
        </div>
        
        <ul className="navbar-menu">
          <li className="navbar-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active' : ''}
              end
            >
              Home
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink 
              to="/about" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              About
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink 
              to="/vapor" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Vapor
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar;