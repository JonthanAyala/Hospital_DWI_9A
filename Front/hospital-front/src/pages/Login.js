import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { validateField } from '../utils/validations';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validación en tiempo real
    if (name === 'username') {
      const usernameErrors = validateField(value, 'username', true);
      setErrors(prev => ({
        ...prev,
        username: usernameErrors.length > 0 ? usernameErrors[0] : ''
      }));
    } else if (name === 'password') {
      let passwordError = '';
      if (!value.trim()) {
        passwordError = 'La contraseña es obligatoria';
      } else if (value.length < 6) {
        passwordError = 'La contraseña debe tener al menos 6 caracteres';
      }
      setErrors(prev => ({
        ...prev,
        password: passwordError
      }));
    }
    
    setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar usuario usando validations.js
    const usernameErrors = validateField(formData.username, 'username', true);
    if (usernameErrors.length > 0) {
      newErrors.username = usernameErrors[0];
    }

    // Validar password (obligatorio, mínimo 6 caracteres)
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setLoginError('');

    try {
      const result = await login({
        username: formData.username.trim(),
        password: formData.password
      });

      if (result.success) {
        const userRole = result.user?.rol?.name;

        switch (userRole) {
          case 'ADMIN':
            navigate('/admin');
            break;
          case 'SECRETARIA':
            navigate('/secretaria');
            break;
          case 'ENFERMERA':
            navigate('/enfermera');
            break;
          default:
            navigate('/');
        }
      } else {
        setLoginError(result.message || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error de login:', error);
      if (error.response?.status === 401) {
        setLoginError('Usuario o contraseña incorrectos');
      } else if (error.response?.status === 403) {
        setLoginError('Acceso denegado');
      } else if (error.response?.status >= 500) {
        setLoginError('Error del servidor. Intente más tarde.');
      } else {
        setLoginError('Error de conexión. Verifique su conexión a internet.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏥 Sistema Hospitalario</h1>
          <p>Iniciar Sesión</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <FormField
            label="Usuario"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="Ingrese su usuario"
            required
          />

          <FormField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Ingrese su contraseña"
            required
          />

          {loginError && (
            <div className="login-error">
              {loginError}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={loading}
            className="login-btn"
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="login-footer">
          <p>
            Sistema de gestión hospitalaria<br />
            <small>Roles: Admin, Secretaria, Enfermera</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
