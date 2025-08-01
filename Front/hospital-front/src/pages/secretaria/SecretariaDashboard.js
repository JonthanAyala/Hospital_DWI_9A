import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import RegisterBedModal from './RegisterBedModal';
import TransferNurseModal from './TransferNurseModal';
import axiosInstance from '../../services/axios';
import './SecretariaDashboard.css';

const SecretariaDashboard = () => {
  const [beds, setBeds] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState('');
  const [showRegisterBedModal, setShowRegisterBedModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [error, setError] = useState('');

  const floors = [
    { value: '1', label: 'Piso 1' },
    { value: '2', label: 'Piso 2' },
    { value: '3', label: 'Piso 3' },
    { value: '4', label: 'Piso 4' },
    { value: '5', label: 'Piso 5' }
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedFloor) {
      fetchBedsByFloor(selectedFloor);
    } else {
      fetchAllBeds();
    }
  }, [selectedFloor]);

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
      const response = await axiosInstance.get('/beds');
      const bedsData = Array.isArray(response.data) ? response.data : [];
      setBeds(bedsData);
    } catch (error) {
      console.error('Error fetching beds:', error);
      setBeds([]); // Reset a array vacío en caso de error
      throw error;
    }
  };

  const fetchBedsByFloor = async (floor) => {
    try {
      const response = await axiosInstance.get(`/beds?floor=${floor}`);
      const bedsData = Array.isArray(response.data) ? response.data : [];
      setBeds(bedsData);
    } catch (error) {
      console.error('Error fetching beds by floor:', error);
      setError('Error al cargar camas del piso');
      setBeds([]); // Reset a array vacío en caso de error
    }
  };

  const fetchNurses = async () => {
    try {
      const response = await axiosInstance.get('/users?role=ENFERMERA');
      const nursesData = Array.isArray(response.data) ? response.data : [];
      setNurses(nursesData);
    } catch (error) {
      console.error('Error fetching nurses:', error);
      setNurses([]); // Reset a array vacío en caso de error
      throw error;
    }
  };

  const handleBedRegistered = () => {
    setShowRegisterBedModal(false);
    if (selectedFloor) {
      fetchBedsByFloor(selectedFloor);
    } else {
      fetchAllBeds();
    }
  };

  const handleNurseTransferred = () => {
    setShowTransferModal(false);
    fetchNurses();
  };

  const handleFloorChange = (e) => {
    setSelectedFloor(e.target.value);
  };

  const bedColumns = [
    {
      key: 'id',
      header: 'ID Cama'
    },
    {
      key: 'floor',
      header: 'Piso'
    },
    {
      key: 'room',
      header: 'Habitación'
    },
    {
      key: 'status',
      header: 'Estado',
      render: (status) => (
        <span className={`status-badge status-${status.toLowerCase()}`}>
          {status === 'AVAILABLE' ? 'Disponible' : 
           status === 'OCCUPIED' ? 'Ocupada' : 'Mantenimiento'}
        </span>
      )
    },
    {
      key: 'assignedNurse',
      header: 'Enfermera Asignada',
      render: (nurse) => nurse ? nurse.name : 'Sin asignar'
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
                <FormField
                  label=""
                  type="select"
                  name="floor"
                  value={selectedFloor}
                  onChange={handleFloorChange}
                  options={floors}
                  placeholder="Todos los pisos"
                />
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
      </div>
    </div>
  );
};

export default SecretariaDashboard;
