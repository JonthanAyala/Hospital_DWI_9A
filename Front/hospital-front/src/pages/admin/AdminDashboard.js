import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import RegisterUserModal from './RegisterUserModal';
import axiosInstance from '../../services/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users');
      
      // Asegurar que la respuesta es un array
      const userData = Array.isArray(response.data) ? response.data : [];
      setUsers(userData);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al cargar usuarios');
      setUsers([]); // Reset a array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleUserRegistered = () => {
    setShowRegisterModal(false);
    fetchUsers(); // Recargar la lista
  };

  const columns = [
    {
      key: 'id',
      header: 'ID'
    },
    {
      key: 'name',
      header: 'Nombre'
    },
    {
      key: 'username',
      header: 'Usuario'
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'rol',
      header: 'Rol',
      render: (rol) => (
        <span className={`role-badge role-${rol.name.toLowerCase()}`}>
          {rol.name}
        </span>
      )
    },
    {
      key: 'floor',
      header: 'Piso',
      render: (floor) => floor ? floor.name : 'Sin asignar'
    },
    {
      key: 'phone',
      header: 'Teléfono'
    }
  ];

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner">Cargando usuarios...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>👨‍💼 Panel de Administración</h1>
          <p>Gestión de usuarios del sistema hospitalario</p>
        </div>

        <div className="dashboard-actions">
          <Button
            variant="primary"
            onClick={() => setShowRegisterModal(true)}
          >
            ➕ Registrar Usuario
          </Button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <Button 
              variant="outline" 
              size="small" 
              onClick={fetchUsers}
            >
              Reintentar
            </Button>
          </div>
        )}

        <div className="dashboard-content">
          <div className="users-section">
            <h2>Lista de Usuarios ({users.length})</h2>
            <Table
              columns={columns}
              data={users}
            />
          </div>
        </div>

        {showRegisterModal && (
          <RegisterUserModal
            onClose={() => setShowRegisterModal(false)}
            onUserRegistered={handleUserRegistered}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
