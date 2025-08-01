import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import RegisterPatientModal from './RegisterPatientModal';
import axiosInstance from '../../services/axios';
import './EnfermeraDashboard.css';

const EnfermeraDashboard = () => {
  const [assignedBeds, setAssignedBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterPatientModal, setShowRegisterPatientModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAssignedBeds(),
        fetchPatients()
      ]);
      setError('');
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedBeds = async () => {
    try {
      const response = await axiosInstance.get('/beds/assigned');
      const bedsData = Array.isArray(response.data) ? response.data : [];
      setAssignedBeds(bedsData);
    } catch (error) {
      console.error('Error fetching assigned beds:', error);
      setAssignedBeds([]); // Reset a array vacío en caso de error
      throw error;
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axiosInstance.get('/patients');
      const patientsData = Array.isArray(response.data) ? response.data : [];
      setPatients(patientsData);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]); // Reset a array vacío en caso de error
      throw error;
    }
  };

  const handlePatientRegistered = () => {
    setShowRegisterPatientModal(false);
    fetchPatients();
  };

  const handleDischargePatient = async (patient) => {
    const confirmed = window.confirm(
      `¿Está seguro que desea dar de alta a ${patient.name}?`
    );

    if (!confirmed) return;

    try {
      await axiosInstance.put(`/patients/${patient.id}/discharge`);
      alert(`Paciente ${patient.name} dado de alta exitosamente`);
      fetchPatients();
      fetchAssignedBeds(); // Actualizar camas disponibles
    } catch (error) {
      console.error('Error discharging patient:', error);
      alert('Error al dar de alta al paciente');
    }
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
      key: 'currentPatient',
      header: 'Paciente',
      render: (patient) => patient ? patient.name : 'Sin paciente'
    }
  ];

  const patientColumns = [
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
      key: 'admissionDate',
      header: 'Fecha Ingreso',
      render: (date) => new Date(date).toLocaleDateString('es-ES')
    },
    {
      key: 'assignedBed',
      header: 'Cama',
      render: (bed) => bed ? bed.id : 'Sin cama'
    },
    {
      key: 'status',
      header: 'Estado',
      render: (status) => (
        <span className={`patient-status-badge patient-${status.toLowerCase()}`}>
          {status === 'ACTIVE' ? 'Activo' : 
           status === 'DISCHARGED' ? 'Alta' : status}
        </span>
      )
    }
  ];

  const patientActions = [
    {
      label: 'Dar de Alta',
      onClick: handleDischargePatient,
      className: 'success',
      disabled: (patient) => patient.status === 'DISCHARGED'
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
      <div className="enfermera-dashboard">
        <div className="dashboard-header">
          <h1>👩‍⚕️ Panel de Enfermera</h1>
          <p>Gestión de pacientes y camas asignadas</p>
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
          {/* Sección de Camas Asignadas */}
          <div className="section">
            <div className="section-header">
              <h2>🛏️ Mis Camas Asignadas ({assignedBeds.length})</h2>
            </div>

            <Table
              columns={bedColumns}
              data={assignedBeds}
            />
          </div>

          {/* Sección de Pacientes */}
          <div className="section">
            <div className="section-header">
              <h2>🏥 Gestión de Pacientes</h2>
              <Button
                variant="primary"
                onClick={() => setShowRegisterPatientModal(true)}
              >
                ➕ Registrar Paciente
              </Button>
            </div>

            <Table
              columns={patientColumns}
              data={patients}
              actions={patientActions}
            />
          </div>
        </div>

        {/* Modal de Registro de Paciente */}
        {showRegisterPatientModal && (
          <RegisterPatientModal
            onClose={() => setShowRegisterPatientModal(false)}
            onPatientRegistered={handlePatientRegistered}
            availableBeds={assignedBeds.filter(bed => bed.status === 'AVAILABLE')}
          />
        )}
      </div>
    </div>
  );
};

export default EnfermeraDashboard;
