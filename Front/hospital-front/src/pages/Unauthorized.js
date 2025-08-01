import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import './Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    if (user?.rol?.name) {
      switch (user.rol.name) {
        case 'ROLE_ADMIN':
          navigate('/admin');
          break;
        case 'ROLE_SECRETARIA':
          navigate('/secretaria');
          break;
        case 'ROLE_ENFERMERA':
          navigate('/enfermera');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">🚫</div>
        <h1>Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        <p>Tu rol actual: <strong>{user?.role || 'No definido'}</strong></p>
        
        <div className="unauthorized-actions">
          <Button
            variant="primary"
            onClick={handleGoBack}
          >
            Ir a Mi Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
