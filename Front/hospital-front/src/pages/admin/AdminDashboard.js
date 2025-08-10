import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import RegisterUserModal from './RegisterUserModal';
import EditUserModal from './EditUserModal';
import FloorModal from './FloorModal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../../services/axios';
import './AdminDashboard.css';
import { userService, floorService } from '../../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFloorModal, setShowFloorModal] = useState(false);

  const [userToEdit, setUserToEdit] = useState(null);
  const [floorToEdit, setFloorToEdit] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchFloors();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users');
      const userData = Array.isArray(response.data.data) ? response.data.data : [];
      setUsers(userData);
      setError('');
    } catch (error) {
      setError('Error al cargar usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFloors = async () => {
    try {
      const response = await floorService.getAllFloors();
      setFloors(response.data ?? []);
    } catch (error) {
      console.error('Error al obtener pisos:', error);
      setFloors([]);
    }
  };

  const handleUserRegistered = () => {
    setShowRegisterModal(false);
    fetchUsers();
  };

  const handleFloorSaved = () => {
    setShowFloorModal(false);
    setFloorToEdit(null);
    fetchFloors(); // Refresca pisos automáticamente
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await userService.deleteUser(userId);
      fetchUsers();
      alert('Usuario eliminado correctamente');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al eliminar usuario';
      alert(msg);
    }
  };

  const handleDeleteFloor = async (floorId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este piso?')) return;
    try {
      await floorService.deleteFloor(floorId);
      fetchFloors();
      alert('Piso eliminado correctamente');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al eliminar piso';
      alert(msg);
    }
  };

  const userColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'username', header: 'Usuario' },
    { key: 'email', header: 'Email' },
    {
      key: 'rol',
      header: 'Rol',
      render: (rol) => <span className={`role-badge role-${rol.name.toLowerCase()}`}>{rol.name}</span>
    },
    {
      key: 'floor',
      header: 'Piso',
      render: (floor) => floor ? floor.name : 'Sin asignar'
    },
    { key: 'phone', header: 'Teléfono' },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2 justify-center">
          <button className="edit-btn" title="Editar" onClick={() => { setUserToEdit(row); setShowEditModal(true); }}>
            <FaEdit className="inline text-lg" />
          </button>
          <button className="delete-btn" title="Eliminar" onClick={() => handleDeleteUser(row.id)}>
            <FaTrash className="inline text-lg" />
          </button>
        </div>
      )
    }
  ];

  const floorColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'description', header: 'Descripción' },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2 justify-center">
          <button className="edit-btn" title="Editar" onClick={() => { setFloorToEdit(row); setShowFloorModal(true); }}>
            <FaEdit className="inline text-lg" />
          </button>
          <button className="delete-btn" title="Eliminar" onClick={() => handleDeleteFloor(row.id)}>
            <FaTrash className="inline text-lg" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner">Cargando usuarios...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>👨‍💼 Panel de Administración</h1>
          <p>Gestión de usuarios del sistema hospitalario</p>
        </div>
        <div className="dashboard-actions">
          <Button variant="primary" onClick={() => setShowRegisterModal(true)}>
            ➕ Registrar Usuario
          </Button>
        </div>
        {error && (
          <div className="error-message">
            {error}
            <Button variant="outline" size="small" onClick={fetchUsers}>Reintentar</Button>
          </div>
        )}
        <div className="dashboard-content">
          <div className="users-section">
            <h2>Lista de Usuarios ({users?.length ?? 0})</h2>
            <Table columns={userColumns} data={users} />
          </div>
          <div className="floors-section mt-10">
            <div className="dashboard-actions">
              <h2 className="text-lg font-bold">Pisos Registrados ({floors?.length ?? 0})</h2>
              <Button variant="secondary" onClick={() => { setFloorToEdit(null); setShowFloorModal(true); }}>
                ➕ Registrar Piso
              </Button>
            </div>
            <Table columns={floorColumns} data={floors} />
          </div>
        </div>
      </div>
      {showRegisterModal && (
        <RegisterUserModal
          onClose={() => setShowRegisterModal(false)}
          onUserRegistered={handleUserRegistered}
        />
      )}
      {showEditModal && (
        <EditUserModal
          user={userToEdit}
          onClose={() => { setShowEditModal(false); setUserToEdit(null); }}
          onUserUpdated={handleUserRegistered}
        />
      )}
      {showFloorModal && (
        <FloorModal
          floor={floorToEdit}
          onClose={() => { setShowFloorModal(false); setFloorToEdit(null); }}
          onSaved={handleFloorSaved}
        />
      )}
    </>
  );
};

export default AdminDashboard;
