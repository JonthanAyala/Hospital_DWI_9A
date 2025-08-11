import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import RegisterPatientModal from './RegisterPatientModal';
import axiosInstance from '../../services/axios';
import './EnfermeraDashboard.css';

// Componente del dashboard principal de la enfermera
const EnfermeraDashboard = () => {
    // Estado para almacenar las camas asignadas, los pacientes y el estado de carga
    const [assignedBeds, setAssignedBeds] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRegisterPatientModal, setShowRegisterPatientModal] = useState(false);
    const [error, setError] = useState('');

    // --- Funciones de Llamada a la API ---

    // Obtiene las camas asignadas y los pacientes del enfermero logeado.
    // MODIFICADO: Combinamos las dos llamadas en una sola, ya que el nuevo endpoint
    // del backend trae toda la información junta.
    const fetchBedsAndPatients = useCallback(async (nurseId) => {
        try {
            // Se usa el nuevo endpoint que creamos en el backend
            const response = await axiosInstance.get(`/user-has-beds/by-user/${nurseId}`);
            const data = Array.isArray(response.data) ? response.data : [];

            // A partir de los datos, extraemos la información de las camas y los pacientes
            const bedsData = data.map(uhb => ({
                id: uhb.bed.id,
                identifier: uhb.bed.identifier,
                isOccupied: uhb.bed.isOccupied,
                patient: uhb.patient || null, // Guardamos el objeto paciente
            }));

            // También extraemos los pacientes activos
            const patientsData = data
                .filter(uhb => uhb.patient) // Filtramos solo las camas con paciente asignado
                .map(uhb => ({
                    id: uhb.patient.id,
                    name: uhb.patient.name,
                    email: uhb.patient.email,
                    phone: uhb.patient.phone,
                    admissionDate: uhb.patient.admissionDate,
                    dischargeDate: uhb.patient.dischargeDate,
                    bed: uhb.bed, // Se mantiene la referencia a la cama
                }));

            setAssignedBeds(bedsData);
            setPatients(patientsData);
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            setError('Error al cargar los pacientes. Revisa la consola para más detalles.');
            setAssignedBeds([]);
            setPatients([]);
            throw error;
        }
    }, []);

    // Función principal para cargar todos los datos.
    const fetchInitialData = useCallback(async () => {
        try {
            setLoading(true);
            setError(''); // Limpiamos errores anteriores
            // TODO: Reemplazar el 7 por el ID real del usuario logeado
            const nurseId = 7; 
            await fetchBedsAndPatients(nurseId);
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchBedsAndPatients]);

    // Se usa `useEffect` para cargar los datos al montar el componente.
    // El array de dependencias vacío asegura que se ejecute solo una vez.
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // --- Manejo de Eventos ---

    // Se llama al registrar un nuevo paciente.
    const handlePatientRegistered = () => {
        setShowRegisterPatientModal(false);
        fetchInitialData(); // Llama a la función principal para refrescar todo
    };

    // Función para dar de alta a un paciente
    const handleDischargePatient = async (patient) => {
        // En lugar de `window.confirm`, usa un modal para una mejor UX
        if (!window.confirm(`¿Está seguro que desea dar de alta a ${patient.name}?`)) {
            return;
        }

        try {
            await axiosInstance.put(`/patients/${patient.id}/discharge`);
            window.alert(`Paciente ${patient.name} dado de alta exitosamente`);
            fetchInitialData(); // Refresca las tablas después de la acción
        } catch (error) {
            console.error('Error al dar de alta al paciente:', error);
            window.alert('Error al dar de alta al paciente');
        }
    };

    // --- Definición de Tablas y UI ---

    // Columnas para la tabla de camas
    const bedColumns = [
        { key: 'id', header: 'ID Cama' },
        { key: 'identifier', header: 'Identificador' },
        {
            key: 'isOccupied',
            header: 'Estado',
            render: (isOccupied) => (
                <span className={`status-badge status-${isOccupied ? 'occupied' : 'available'}`}>
                    {isOccupied ? 'Ocupada' : 'Disponible'}
                </span>
            ),
        },
        {
            key: 'patient',
            header: 'Paciente',
            // MODIFICADO: Accedemos directamente a la propiedad patient.name del objeto
            render: (patient) => (patient ? patient.name : 'Sin paciente'),
        },
    ];

    // Columnas para la tabla de pacientes
    const patientColumns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Nombre' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Teléfono' },
        {
            key: 'admissionDate',
            header: 'Fecha Ingreso',
            render: (date) => new Date(date).toLocaleDateString('es-ES'),
        },
        {
            key: 'bed',
            header: 'Cama',
            render: (bed) => bed ? bed.identifier : 'Sin cama',
        },
        {
            key: 'dischargeDate',
            header: 'Estado',
            render: (dischargeDate) => (
                <span className={`patient-status-badge patient-${dischargeDate ? 'discharged' : 'active'}`}>
                    {dischargeDate ? 'Alta' : 'Activo'}
                </span>
            ),
        },
    ];

    // Acciones para la tabla de pacientes
    const patientActions = [
        {
            label: 'Dar de Alta',
            onClick: handleDischargePatient,
            className: 'success',
            // Desactiva el botón si el paciente ya está dado de alta
            disabled: (patient) => !!patient.dischargeDate,
        },
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
                        {assignedBeds.length > 0 ? (
                            <Table columns={bedColumns} data={assignedBeds} />
                        ) : (
                            <p className="empty-state-message">No se encontraron camas asignadas. Revisa tu base de datos o contacta a la secretaria.</p>
                        )}
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
                        {patients.length > 0 ? (
                            <Table columns={patientColumns} data={patients} actions={patientActions} />
                        ) : (
                            <p className="empty-state-message">No se encontraron pacientes asignados. Revisa tu base de datos o registra un nuevo paciente.</p>
                        )}
                    </div>
                </div>

                {/* Modal de Registro de Paciente */}
                {showRegisterPatientModal && (
                    <RegisterPatientModal
                        assignedBeds={assignedBeds.filter(bed => !bed.isOccupied)}
                        onClose={() => setShowRegisterPatientModal(false)}
                        onPatientRegistered={handlePatientRegistered}
                    />
                )}
            </div>
        </div>
    );
};

export default EnfermeraDashboard;