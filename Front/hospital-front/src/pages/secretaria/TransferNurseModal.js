import React, { useState } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import axiosInstance from '../../services/axios';

const TransferNurseModal = ({ nurse, onClose, onNurseTransferred }) => {
  const [formData, setFormData] = useState({
    floorId: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const floorOptions = [
    { value: '1', label: 'Piso 1' },
    { value: '2', label: 'Piso 2' },
    { value: '3', label: 'Piso 3' },
    { value: '4', label: 'Piso 4' },
    { value: '5', label: 'Piso 5' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.floorId) {
      setSubmitError('Debe seleccionar un piso');
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      await axiosInstance.put(`/users/nurses/${nurse.id}/transfer/${formData.floorId}`);
      
      onNurseTransferred();
      alert(`Enfermera ${nurse.name} transferida exitosamente al Piso ${formData.floorId}`);
    } catch (error) {
      console.error('Error transferring nurse:', error);
      setSubmitError(
        error.response?.data?.message || 
        'Error al transferir enfermera. Intente nuevamente.'
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
          <h2>🔄 Transferir Enfermera</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div className="nurse-info">
            <h3>Información de la Enfermera</h3>
            <p><strong>Nombre:</strong> {nurse.name}</p>
            <p><strong>Email:</strong> {nurse.email}</p>
            <p><strong>Piso Actual:</strong> {nurse.assignedFloor ? `Piso ${nurse.assignedFloor}` : 'Sin asignar'}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <FormField
              label="Nuevo Piso"
              type="select"
              name="floorId"
              value={formData.floorId}
              onChange={handleChange}
              options={floorOptions}
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
                variant="warning"
                loading={loading}
              >
                Transferir
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferNurseModal;
