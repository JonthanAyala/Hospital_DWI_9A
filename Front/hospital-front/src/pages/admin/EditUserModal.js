import React, { useState, useEffect } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { validateField } from '../../utils/validations';
import { userService, floorService } from '../../services/api';
import './EditUserModal.css';

const EditUserModal = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    rolId: user?.rol?.id || '',
    floorId: user?.floor?.id || '',
    phone: user?.phone || '',
    password: ''
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
      const response = await floorService.getAllFloors();
      setFloors(response?.data || []);
    } catch (error) {
      console.error('Error cargando pisos', error);
      setFloors([]);
    }
  };

  const roleOptions = [
    { value: 1, label: 'Administrador' },
    { value: 2, label: 'Secretaria' },
    { value: 3, label: 'Enfermera' }
  ];

  const floorOptions = Array.isArray(floors)
    ? floors.map(floor => ({
        value: floor.id,
        label: floor.name
      }))
    : [];

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
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    const usernameErrors = validateField(formData.username, 'username', true);
    if (usernameErrors.length > 0) newErrors.username = usernameErrors[0];
    const emailErrors = validateField(formData.email, 'email', true);
    if (emailErrors.length > 0) newErrors.email = emailErrors[0];
    if (!formData.rolId) newErrors.rolId = 'Debe seleccionar un rol';
    if ((formData.rolId == 2 || formData.rolId == 3) && !formData.floorId)
      newErrors.floorId = 'Debe seleccionar un piso';
    const phoneErrors = validateField(formData.phone, 'phone', true);
    if (phoneErrors.length > 0) newErrors.phone = phoneErrors[0];

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError('');

    try {
      const payload = {
  id: user.id, // 👈 Esto es lo que faltaba
  ...formData,
  rolId: parseInt(formData.rolId),
  floorId: formData.floorId ? parseInt(formData.floorId) : null
};


      await userService.updateUser(user.id, payload);
onUserUpdated(); // Refresca la lista
onClose();       // ✅ Cierra el modal automáticamente
alert('Usuario actualizado exitosamente');

    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setSubmitError(
        error.response?.data?.message || 'Error inesperado al actualizar'
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
          <h2>✏️ Editar Usuario</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <FormField label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
          <FormField label="Nombre de Usuario" name="username" value={formData.username} onChange={handleChange} error={errors.username} required />
          <FormField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} required />

          <div className="form-row">
            <FormField
              label="Rol"
              type="select"
              name="rolId"
              value={formData.rolId}
              onChange={handleChange}
              error={errors.rolId}
              options={roleOptions}
              required
            />
            {(formData.rolId == 2 || formData.rolId == 3) && (
              <FormField
                label="Piso Asignado"
                type="select"
                name="floorId"
                value={formData.floorId}
                onChange={handleChange}
                error={errors.floorId}
                options={floorOptions}
                required
              />
            )}
            <FormField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} required />
          </div>

          {submitError && <div className="submit-error">{submitError}</div>}

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Actualizar Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
