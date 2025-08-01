import React, { useState, useEffect } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { validateField } from '../../utils/validations';
import { roleService, floorService } from '../../services/api';
import axiosInstance from '../../services/axios';
import './RegisterUserModal.css';

const RegisterUserModal = ({ onClose, onUserRegistered }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rolId: '',
    floorId: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [roles, setRoles] = useState([]);
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    fetchRolesAndFloors();
  }, []);

  const fetchRolesAndFloors = async () => {
    try {
      const [rolesData, floorsData] = await Promise.all([
        roleService.getAllRoles(),
        floorService.getAllFloors()
      ]);
      setRoles(rolesData);
      setFloors(floorsData);
    } catch (error) {
      console.error('Error fetching roles and floors:', error);
      // Usar valores por defecto si falla la carga
      setRoles([
        { id: 1, name: 'ROLE_ADMIN' },
        { id: 2, name: 'ROLE_SECRETARIA' },
        { id: 3, name: 'ROLE_ENFERMERA' }
      ]);
      setFloors([
        { id: 1, name: 'P1' },
        { id: 2, name: 'P2' },
        { id: 3, name: 'P3' },
        { id: 4, name: 'P4' },
        { id: 5, name: 'P5' }
      ]);
    }
  };

  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.name === 'ROLE_ADMIN' ? 'Administrador' : 
           role.name === 'ROLE_SECRETARIA' ? 'Secretaria' : 'Enfermera'
  }));

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

    // Validar usuario
    const usernameErrors = validateField(formData.username, 'username', true);
    if (usernameErrors.length > 0) {
      newErrors.username = usernameErrors[0];
    }

    // Validar email
    const emailErrors = validateField(formData.email, 'email', true);
    if (emailErrors.length > 0) {
      newErrors.email = emailErrors[0];
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar rol
    if (!formData.rolId) {
      newErrors.rolId = 'Debe seleccionar un rol';
    }

    // Validar piso (solo para enfermeras)
    if (formData.rolId === 3 && !formData.floorId) {
      newErrors.floorId = 'Debe seleccionar un piso para la enfermera';
    }

    // Validar teléfono
    const phoneErrors = validateField(formData.phone, 'phone', true);
    if (phoneErrors.length > 0) {
      newErrors.phone = phoneErrors[0];
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
      const { confirmPassword, ...userData } = formData;
      // Convertir IDs a números
      const payload = {
        ...userData,
        rolId: parseInt(userData.rolId),
        floorId: userData.floorId ? parseInt(userData.floorId) : null
      };
      
      await axiosInstance.post('/users/register', payload);
      
      onUserRegistered();
      alert('Usuario registrado exitosamente');
    } catch (error) {
      console.error('Error registering user:', error);
      setSubmitError(
        error.response?.data?.message || 
        'Error al registrar usuario. Intente nuevamente.'
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
          <h2>➕ Registrar Nuevo Usuario</h2>
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
            placeholder="Ej: Juan Pérez"
            required
          />

          <FormField
            label="Nombre de Usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="usuario123"
            required
          />

          <FormField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="usuario@hospital.com"
            required
          />

          <div className="form-row">
            <FormField
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Mínimo 6 caracteres"
              required
            />

            <FormField
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Repetir contraseña"
              required
            />
          </div>

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

            {formData.rolId === 3 && (
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
            >
              Registrar Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserModal;
