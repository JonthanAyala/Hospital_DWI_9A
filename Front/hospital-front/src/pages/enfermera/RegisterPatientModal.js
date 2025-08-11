import React, { useState, useEffect, useCallback } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { validateField } from '../../utils/validations';
import { patientService, bedService } from '../../services/api';

const RegisterPatientModal = ({ onClose, onPatientRegistered }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bedId: '',
        medicalHistory: ''
    });
    const [availableBeds, setAvailableBeds] = useState([]); 
    const [loadingBeds, setLoadingBeds] = useState(true);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

 const fetchAvailableBeds = useCallback(async () => {
    try {
        setLoadingBeds(true);
        // La respuesta de la API ya es el arreglo, no un objeto con propiedad 'data'
        const response = await bedService.getAvailableBeds();

        if (response && Array.isArray(response)) {
            setAvailableBeds(response);
        } else {
            console.error('La respuesta de la API para camas disponibles no es un arreglo.');
            setAvailableBeds([]);
        }
    } catch (error) {
        console.error('Error fetching available beds:', error);
        setAvailableBeds([]);
    } finally {
        setLoadingBeds(false);
    }
}, []);

    useEffect(() => {
        fetchAvailableBeds();
    }, [fetchAvailableBeds]);

    const bedOptions = availableBeds.map(bed => ({
        value: bed.id,
        label: `CAMA-${bed.identifier} - Piso ${bed.floor.name}`
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        setSubmitError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }

        const emailErrors = validateField(formData.email, 'email', true);
        if (emailErrors.length > 0) {
            newErrors.email = emailErrors[0];
        }

        const phoneErrors = validateField(formData.phone, 'phone', true);
        if (phoneErrors.length > 0) {
            newErrors.phone = phoneErrors[0];
        }

        if (!formData.bedId) {
            newErrors.bedId = 'Debe seleccionar una cama';
        }

        if (!formData.medicalHistory.trim()) {
            newErrors.medicalHistory = 'El historial médico es obligatorio';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSubmitError('');

        try {
            // **Ajuste para enviar los datos de la cama correctamente**
            const patientDataToSend = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                bed: { id: formData.bedId }, // Asume que el backend espera un objeto anidado
                medicalHistory: formData.medicalHistory
            };

            await patientService.registerPatient(patientDataToSend);
            
            onPatientRegistered();
            onClose();
        } catch (error) {
            console.error('Error registering patient:', error);
            setSubmitError(
                error.response?.data?.message || 
                'Error al registrar paciente. Intente nuevamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target.className === 'modal-backdrop') {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>🏥 Registrar Nuevo Paciente</h2>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <FormField
                        label="Nombre Completo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Ej: María García"
                        required
                    />

                    <div className="form-row">
                        <FormField
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="paciente@email.com"
                            required
                        />

                        <FormField
                            label="Teléfono"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={errors.phone}
                            placeholder="1234567890"
                            required
                        />
                    </div>

                    <FormField
                        label="Cama Asignada"
                        type="select"
                        name="bedId"
                        value={formData.bedId}
                        onChange={handleChange}
                        error={errors.bedId}
                        options={bedOptions}
                        required
                        disabled={loadingBeds}
                    />

                    {loadingBeds ? (
                        <div className="loading-message">Cargando camas...</div>
                    ) : (
                        bedOptions.length === 0 && (
                            <div className="warning-message">
                                ⚠️ No hay camas disponibles en este momento
                            </div>
                        )
                    )}

                    <FormField
                        label="Historial Médico"
                        type="textarea"
                        name="medicalHistory"
                        value={formData.medicalHistory}
                        onChange={handleChange}
                        error={errors.medicalHistory}
                        placeholder="Describa el motivo de ingreso, síntomas, diagnóstico inicial..."
                        required
                    />

                    {submitError && (
                        <div className="submit-error">
                            {submitError}
                        </div>
                    )}

                    <div className="modal-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            disabled={bedOptions.length === 0 || loading}
                        >
                            Registrar Paciente
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPatientModal;