import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../services/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario logueado al cargar la aplicación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth', credentials);
      const token = response.data.data; // El token está en data.data
      
      if (!token) {
        throw new Error('No se recibió token del servidor');
      }
      
      // Guardar el token
      localStorage.setItem('token', token);
      
      // Decodificar el JWT para obtener información básica del usuario
      try {
        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub; // El username está en 'sub'
        const roleName = decodedToken.role; // El rol está en 'role'
        
        // Crear un objeto de usuario básico con la información del token
        const userData = {
          username: username,
          token: token,
          rol: {
            name: roleName
          }
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      } catch (tokenError) {
        console.error('Error decodificando token:', tokenError);
        localStorage.removeItem('token');
        return { 
          success: false, 
          message: 'Error procesando el token de autenticación' 
        };
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de autenticación' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (requiredRole) => {
    return user?.rol?.name === requiredRole;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.rol?.name);
  };

  const value = {
    user,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
