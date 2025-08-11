import React, { useState, useEffect } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { floorService, bedService } from '../../services/api';

const EditBedModal = ({ bed, onClose, onBedUpdated }) => {
  const [formData, setFormData] = useState({
    identifier: bed.identifier || '',
    floorId: bed.floor?.id || ''
  });
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await floorService.getAllFloors();
        // El error se produce aquí. La respuesta del servicio es un objeto
        // que contiene la lista de pisos en la propiedad `data`.
        setFloors(response.data);
      } catch {
        // Si falla la API, usar los datos por defecto
        setFloors([
          { id: 1, name: 'P1' },
          { id: 2, name: 'P2' },
          { id: 3, name: 'P3' },
          { id: 4, name: 'P4' },
          { id: 5, name: 'P5' }
        ]);
      }
    };
    fetchFloors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bedService.updateBed(bed.id, {
        identifier: formData.identifier,
        floorId: parseInt(formData.floorId)
      });
      onBedUpdated();
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Error al actualizar cama');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>✏️ Editar Cama</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <FormField
            label="Identificador"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
          <FormField
            label="Piso"
            name="floorId"
            type="select"
            value={formData.floorId}
            onChange={handleChange}
            required
            options={floors.map(f => ({ value: f.id, label: f.name }))}
          />
          {submitError && <div className="submit-error">{submitError}</div>}
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary" loading={loading}>Guardar Cambios</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBedModal;