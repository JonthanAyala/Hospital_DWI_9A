import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardRoute = () => {
    switch (user?.rol?.name) {
      case 'ROLE_ADMIN':
        return '/admin';
      case 'ROLE_SECRETARIA':
        return '/secretaria';
      case 'ROLE_ENFERMERA':
        return '/enfermera';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>🏥 Sistema Hospitalario</h2>
        </div>
        
        <div className="navbar-menu">
          <button 
            className="navbar-link"
            onClick={() => navigate(getDashboardRoute())}
          >
            Dashboard
          </button>
          
          <div className="navbar-user">
            <span className="user-info">
              👤 {user?.name} ({user?.rol?.name})
            </span>
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
