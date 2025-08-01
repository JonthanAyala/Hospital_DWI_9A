import React, { useState } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { validateField } from '../../utils/validations';
import axiosInstance from '../../services/axios';

const RegisterPatientModal = ({ onClose, onPatientRegistered, availableBeds }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bedId: '',
    medicalHistory: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const bedOptions = availableBeds.map(bed => ({
    value: bed.id,
    label: `${bed.id} - Piso ${bed.floor}, Hab. ${bed.room}`
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores mientras el usuario escribe
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

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    // Validar email
    const emailErrors = validateField(formData.email, 'email', true);
    if (emailErrors.length > 0) {
      newErrors.email = emailErrors[0];
    }

    // Validar teléfono
    const phoneErrors = validateField(formData.phone, 'phone', true);
    if (phoneErrors.length > 0) {
      newErrors.phone = phoneErrors[0];
    }

    // Validar cama
    if (!formData.bedId) {
      newErrors.bedId = 'Debe seleccionar una cama';
    }

    // Validar historial médico
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
      await axiosInstance.post('/patients', formData);
      
      onPatientRegistered();
      alert('Paciente registrado exitosamente');
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
          />

          {bedOptions.length === 0 && (
            <div className="warning-message">
              ⚠️ No hay camas disponibles en este momento
            </div>
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
              disabled={bedOptions.length === 0}
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
