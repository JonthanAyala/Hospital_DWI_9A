// Validaciones con Regex
export const validations = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Formato de email inválido'
  },
  username: {
    pattern: /^[a-zA-Z0-9_]{3,20}$/,
    message: 'El usuario debe tener entre 3 y 20 caracteres (letras, números y _)'
  },
  phone: {
    pattern: /^[0-9]{10}$/,
    message: 'El teléfono debe tener exactamente 10 dígitos'
  },
  bedIdentifier: {
    pattern: /^CAMA-\d{2}$/,
    message: 'El identificador de cama debe tener el formato CAMA-XX (ej: CAMA-01)'
  },
  floorName: {
    pattern: /^P\d+$/,
    message: 'El nombre del piso debe tener el formato PX (ej: P1, P2)'
  },
  age: {
    pattern: /^[1-9][0-9]?$/,
    message: 'La edad debe ser un número entre 1 y 99'
  },
  required: {
    message: 'Este campo es obligatorio'
  }
};

// Función para validar un campo
export const validateField = (value, type, isRequired = true) => {
  const errors = [];

  // Validar si es requerido
  if (isRequired && (!value || value.toString().trim() === '')) {
    errors.push(validations.required.message);
    return errors;
  }

  // Si no es requerido y está vacío, no validar más
  if (!isRequired && (!value || value.toString().trim() === '')) {
    return errors;
  }

  // Validar según el tipo
  const validation = validations[type];
  if (validation && !validation.pattern.test(value)) {
    errors.push(validation.message);
  }

  return errors;
};

// Función para validar un formulario completo
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const fieldErrors = [];

    rules.forEach(rule => {
      const fieldValue = formData[field];
      const validation = validateField(fieldValue, rule.type, rule.required);
      fieldErrors.push(...validation);
    });

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Utilidades para formatear datos
export const formatters = {
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES');
  },
  
  formatDateTime: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('es-ES');
  }
};
