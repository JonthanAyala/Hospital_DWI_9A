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
    const checkUser = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error al parsear el usuario:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth', credentials);
      const token = response.data?.data;

      if (!token) throw new Error('Token no recibido del servidor');

      // Guardar el token en localStorage
      localStorage.setItem('token', token);

      // Decodificar el token
      const decodedToken = jwtDecode(token);
      const username = decodedToken.sub;
      const roleName = decodedToken.role;

      // Obtener los datos del usuario por username
      const userResponse = await axiosInstance.get(`/users?username=${username}`);
const usersArray = Array.isArray(userResponse.data?.data) ? userResponse.data.data : [];
const userInfo = usersArray.find(u => u.username === username);

      // ⚠️ Verifica si se encontró el usuario correctamente
      if (!userInfo) throw new Error('Usuario no encontrado');

      // 💾 Aquí armamos el objeto completo con piso incluido
      const userData = {
        id: userInfo.id,
        name: userInfo.name,
        username: userInfo.username,
        email: userInfo.email,
        phone: userInfo.phone,
        rol: userInfo.rol || { name: roleName },
        floor: userInfo.floor || null, // 💥 ESTE CAMPO ES CLAVE
        token
      };

      // Guardar el usuario completo
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };

    } catch (error) {
      console.error('Error en login:', error);

      // Limpiar almacenamiento local si falla
      localStorage.removeItem('token');
      localStorage.removeItem('user');

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
      {!loading && children}
    </AuthContext.Provider>
  );
};
