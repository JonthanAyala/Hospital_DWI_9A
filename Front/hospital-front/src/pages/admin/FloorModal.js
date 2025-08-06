import React, { useState, useEffect } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { floorService } from '../../services/api';

const FloorModal = ({ floor, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    name: floor?.name || '',
    description: floor?.description || ''
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (floor) {
        await floorService.updateFloor(floor.id, formData);
      } else {
        await floorService.createFloor(formData);
      }
      onSaved();
    } catch (error) {
      setSubmitError('Error al guardar el piso');
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
          <h2>{floor ? '✏️ Editar Piso' : '➕ Nuevo Piso'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <FormField
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: P1"
            required
          />
          <FormField
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ej: Piso 1 - Administración"
            required
          />
          {submitError && <div className="submit-error">{submitError}</div>}
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Guardar Piso
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FloorModal;
