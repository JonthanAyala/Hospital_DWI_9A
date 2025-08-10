import React, { useState, useEffect } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { validateField } from '../../utils/validations';
import { floorService } from '../../services/api';
import axiosInstance from '../../services/axios';

const RegisterBedModal = ({ onClose, onBedRegistered }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    floorId: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      const floorsData = await floorService.getAllFloors();
      setFloors(floorsData);
    } catch (error) {
      console.error('Error fetching floors:', error);
      setFloors([
        { id: 1, name: 'P1' },
        { id: 2, name: 'P2' },
        { id: 3, name: 'P3' },
        { id: 4, name: 'P4' },
        { id: 5, name: 'P5' }
      ]);
    }
  };

  const floorOptions = floors.map(floor => ({
    value: floor.id,
    label: `Piso ${floor.name.substring(1)}`
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

    const bedIdErrors = validateField(formData.identifier, 'bedIdentifier', true);
    if (bedIdErrors.length > 0) {
      newErrors.identifier = bedIdErrors[0];
    }

    if (!formData.floorId) {
      newErrors.floorId = 'Debe seleccionar un piso';
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
      await axiosInstance.post('/beds', {
        identifier: formData.identifier,
        floorId: parseInt(formData.floorId, 10)
      });

      onBedRegistered();
      alert('Cama registrada exitosamente');
    } catch (error) {
      console.error('Error registering bed:', error);
      setSubmitError(
        error.response?.data?.message ||
        'Error al registrar cama. Intente nuevamente.'
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
          <h2>🛏️ Registrar Nueva Cama</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <FormField
            label="Identificador de Cama"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            error={errors.identifier}
            placeholder="CAMA-01"
            required
          />

          <FormField
            label="Piso"
            type="select"
            name="floorId"
            value={formData.floorId}
            onChange={handleChange}
            error={errors.floorId}
            options={floorOptions}
            required
          />

          {submitError && (
            <div className="submit-error">{submitError}</div>
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
            >
              Registrar Cama
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterBedModal;
