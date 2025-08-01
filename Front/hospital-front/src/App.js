import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/admin/AdminDashboard';
import SecretariaDashboard from './pages/secretaria/SecretariaDashboard';
import EnfermeraDashboard from './pages/enfermera/EnfermeraDashboard';

import './App.css';

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando aplicación...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Ruta de login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute(user?.rol?.name)} replace />
            ) : (
              <Login />
            )
          } 
        />

        {/* Ruta de acceso denegado */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas protegidas por rol */}
        <Route 
          path="/admin/*" 
          element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/secretaria/*" 
          element={
            <PrivateRoute allowedRoles={['ROLE_SECRETARIA']}>
              <SecretariaDashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/enfermera/*" 
          element={
            <PrivateRoute allowedRoles={['ROLE_ENFERMERA']}>
              <EnfermeraDashboard />
            </PrivateRoute>
          } 
        />

        {/* Ruta por defecto */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute(user?.rol?.name)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Ruta catch-all para páginas no encontradas */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute(user?.rol?.name)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </div>
  );
}

// Función auxiliar para determinar la ruta del dashboard según el rol
function getDashboardRoute(roleName) {
  switch (roleName) {
    case 'ROLE_ADMIN':
      return '/admin';
    case 'ROLE_SECRETARIA':
      return '/secretaria';
    case 'ROLE_ENFERMERA':
      return '/enfermera';
    default:
      return '/login';
  }
}

export default App;
