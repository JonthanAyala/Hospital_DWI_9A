import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import Table from '../../components/Table';
import Button from '../../components/Button';
import RegisterBedModal from './RegisterBedModal';
import TransferNurseModal from './TransferNurseModal';
import { bedService, userService } from '../../services/api';
import './SecretariaDashboard.css';
import EditBedModal from './EditBedModal';


const SecretariaDashboard = () => {
  const { user: contextUser, loading: authLoading } = useAuth();
  // Si el usuario del contexto no tiene piso, lo obtengo del localStorage
  const localUser = JSON.parse(localStorage.getItem('user')) || {};
  const user = contextUser?.floor ? contextUser : localUser;
  const username = user?.username;
  const token = user?.token;
  const roleName = user?.rol?.name || user?.rol;
  const [beds, setBeds] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  // El piso de la secretaria se obtiene del usuario
  const userFloorId = user?.floor?.id;
  const [showRegisterBedModal, setShowRegisterBedModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [error, setError] = useState('');
  const [bedToEdit, setBedToEdit] = useState(null);
  const [bedToDelete, setBedToDelete] = useState(null);

  // Hooks deben ir antes de cualquier return condicional
  useEffect(() => {
    fetchInitialData();
    fetchAllUsers(); // Actualiza el usuario en localStorage con el piso
  }, []);

  useEffect(() => {
    console.log('userFloorId en useEffect:', userFloorId);
    if (userFloorId) {
      fetchBedsByFloor(userFloorId);
      fetchNursesByFloor(userFloorId);
    }
  }, [userFloorId]);

  // Mostrar spinner si el usuario aún está cargando
  if (authLoading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner">Cargando usuario...</div>
        </div>
      </div>
    );
  }

  const floors = [
    { value: '1', label: 'Piso 1' },
    { value: '2', label: 'Piso 2' },
    { value: '3', label: 'Piso 3' },
    { value: '4', label: 'Piso 4' },
    { value: '5', label: 'Piso 5' }
  ];

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAllBeds(),
        fetchNurses()
      ]);
      setError('');
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBeds = async () => {
    try {
      const bedsData = await bedService.getAllBeds();
      setBeds(Array.isArray(bedsData) ? bedsData : []);
    } catch (error) {
      console.error('Error fetching beds:', error);
      setBeds([]);
    }
  };

  const fetchBedsByFloor = async (floorId) => {
    try {
      console.log('Entrando a fetchBedsByFloor con floorId:', floorId);
      const bedsData = await bedService.getBedsByFloor(floorId);
      console.log('Camas recibidas en fetchBedsByFloor:', bedsData);
      console.log('🛏️ Camas individuales:', bedsData?.data?.map(b => ({
  id: b.id,
  identificador: b.identifier,
  ocupada: b.isOccupied,
  piso: b.floor?.name
})));

setBeds(Array.isArray(bedsData.data) ? bedsData.data : []);
    } catch (error) {
      console.error('Error fetching beds by floor:', error);
      setError('Error al cargar camas del piso');
      setBeds([]);
    }
  };

  const fetchNursesByFloor = async (floorId) => {
    try {
      const allUsers = await userService.getAllUsers();
      const usersData = Array.isArray(allUsers.data) ? allUsers.data : [];
      // Filtrar solo enfermeras y por piso asignado
const filtered = usersData.filter(u =>
  (u.rol?.name === 'ENFERMERA' || u.rol?.name === 'ROLE_ENFERMERA') &&
  u.floor?.id === floorId
);
console.log('👀 Usuarios y roles:', usersData.map(u => ({ name: u.name, rol: u.rol?.name, piso: u.floor?.id })));

      setNurses(filtered);

    } catch (error) {
      console.error('Error fetching nurses:', error);
      setNurses([]);
    }
  };

  const fetchNurses = async () => {
    try {
      const allUsers = await userService.getAllUsers();
      const usersData = Array.isArray(allUsers.data) ? allUsers.data : [];
      // Filtrar solo enfermeras y por piso asignado si aplica
      const filtered = userFloorId
        ? usersData.filter(u => u.rol?.name === 'ENFERMERA' && u.floor?.id === userFloorId)
        : usersData.filter(u => u.rol?.name === 'ENFERMERA');
      setNurses(filtered);
    } catch (error) {
      console.error('Error fetching nurses:', error);
      setNurses([]);
    }
  };

  
  const handleBedRegistered = () => {
    setShowRegisterBedModal(false);
    if (userFloorId) {
      fetchBedsByFloor(userFloorId);
    }
  };

  const handleNurseTransferred = () => {
    setShowTransferModal(false);
    if (userFloorId) {
      fetchNursesByFloor(userFloorId);
    }
  };

  const handleEditBed = (bed) => setBedToEdit(bed);
  const handleDeleteBed = (bed) => setBedToDelete(bed);

  const bedColumns = [
  {
    key: 'id',
    header: 'ID'
  },
  {
    key: 'identifier',
    header: 'Identificador'
  },
  {
    key: 'isOccupied',
    header: 'Ocupada',
    render: (value) => value ? 'Sí' : 'No'
  },
  {
    key: 'floorName',
    header: 'Piso',
    render: (_, row) => row.floor?.name || 'Sin piso'
  },
  {
      key: 'actions',
      header: 'Acciones',
      render: (_, row) => (
        <div className="table-actions">
          <Button size="small" variant="outline" onClick={() => handleEditBed(row)}>✏️ Editar</Button>
          <Button size="small" variant="danger" onClick={() => handleDeleteBed(row)}>🗑️ Eliminar</Button>
        </div>
      )
    }
];



  const nurseColumns = [
    {
      key: 'id',
      header: 'ID'
    },
    {
      key: 'name',
      header: 'Nombre'
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'phone',
      header: 'Teléfono'
    },
    {
      key: 'assignedFloor',
      header: 'Piso Asignado',
      render: (floor) => floor ? `Piso ${floor}` : 'Sin asignar'
    }
  ];

  const nurseActions = [
    {
      label: 'Transferir',
      onClick: (nurse) => {
        setShowTransferModal(nurse);
      },
      className: 'warning'
    }
  ];

  // Obtener todos los usuarios
  const fetchAllUsers = async () => {
    try {
      const usersData = await userService.getAllUsers();
      const usersArray = Array.isArray(usersData.data) ? usersData.data : [];
      const userInfo = usersArray.find(u => u.username === username);

      // Mostrar en consola los datos obtenidos
      console.log('Usuario final guardado:', userInfo);

      // Si no se encuentra el usuario, usar solo lo del token
      const userData = userInfo ? {
        ...userInfo,
        token,
        rol: userInfo.rol || { name: roleName }
      } : {
        username,
        token,
        rol: { name: roleName }
      };

      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al cargar usuarios');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner">Cargando datos...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="secretaria-dashboard">
        <div className="dashboard-header">
          <h1>👩‍💼 Panel de Secretaría</h1>
          <p>Gestión de camas y enfermeras</p>
          {/* Mensaje de bienvenida vistoso */}
          {(() => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
              let piso = 'Sin piso';
              if ('floor' in user && user.floor) {
                if (typeof user.floor === 'object' && user.floor.name) {
                  piso = user.floor.name;
                } else if (typeof user.floor === 'string' || typeof user.floor === 'number') {
                  piso = `Piso ${user.floor}`;
                }
              }
              return (
                <div className="secretaria-user-info" style={{
                  background: 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)',
                  borderRadius: '1rem',
                  padding: '1rem 2rem',
                  margin: '1rem 0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  fontSize: '1.25rem',
                  fontWeight: 500
                }}>
                  <span style={{fontSize: '2rem'}}>👋</span>
                  <span>
                    <span style={{color: '#2b7a78', fontWeight: 700}}>Bienvenido, {user.name || user.username}</span>
                    <br />
                    <span style={{color: '#3aafa9'}}>🏢 Piso asignado: <b>{piso}</b></span>
                  </span>
                </div>
              );
            }
            return null;
          })()}
        </div>

        {error && (
          <div className="error-message">
            {error}
            <Button 
              variant="outline" 
              size="small" 
              onClick={fetchInitialData}
            >
              Reintentar
            </Button>
          </div>
        )}

        <div className="dashboard-content">
          {/* Sección de Camas */}
          <div className="section">
            <div className="section-header">
              <h2>🛏️ Gestión de Camas</h2>
              <div className="section-actions">
                <Button
                  variant="primary"
                  onClick={() => setShowRegisterBedModal(true)}
                >
                  ➕ Registrar Cama
                </Button>
              </div>
            </div>

            <Table
              columns={bedColumns}
              data={beds}
            />
          </div>

          {/* Sección de Enfermeras */}
          <div className="section">
            <div className="section-header">
              <h2>👩‍⚕️ Gestión de Enfermeras</h2>
            </div>

            <Table
              columns={nurseColumns}
              data={nurses}
              actions={nurseActions}
            />
          </div>
        </div>

        {/* Modales */}
        {showRegisterBedModal && (
          <RegisterBedModal
            onClose={() => setShowRegisterBedModal(false)}
            onBedRegistered={handleBedRegistered}
          />
        )}

        {showTransferModal && (
          <TransferNurseModal
            nurse={showTransferModal}
            onClose={() => setShowTransferModal(false)}
            onNurseTransferred={handleNurseTransferred}
          />
        )}

                {/* Modal para editar cama */}
        {bedToEdit && (
          <EditBedModal
            bed={bedToEdit}
            onClose={() => setBedToEdit(null)}
            onBedUpdated={() => {
              setBedToEdit(null);
              fetchBedsByFloor(userFloorId);
            }}
          />
        )}

        {/* Modal para eliminar cama */}
        {bedToDelete && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <div className="modal-header">
                <h2>🗑️ Confirmar Eliminación</h2>
                <button className="modal-close" onClick={() => setBedToDelete(null)}>✕</button>
              </div>
              <p>¿Estás seguro de que deseas eliminar la cama <strong>{bedToDelete.identifier}</strong>?</p>
              <div className="modal-actions">
                <Button variant="secondary" onClick={() => setBedToDelete(null)}>Cancelar</Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    try {
                      await bedService.deleteBed(bedToDelete.id);
                      setBedToDelete(null);
                      fetchBedsByFloor(userFloorId);
                      alert('✅ Cama eliminada correctamente');
                    } catch (err) {
                      alert('❌ Error al eliminar la cama');
                      console.error(err);
                    }
                  }}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SecretariaDashboard;
