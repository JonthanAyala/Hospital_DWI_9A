// Roles del sistema (IDs según backend)
export const ROLES = {
  ADMIN: 1,
  SECRETARIA: 2, 
  ENFERMERA: 3
};

// Nombres de roles para mostrar
export const ROLE_NAMES = {
  1: 'ROLE_ADMIN',
  2: 'ROLE_SECRETARIA',
  3: 'ROLE_ENFERMERA'
};

// Estados de cama (según backend: isOccupied boolean)
export const BED_STATUS = {
  AVAILABLE: false,
  OCCUPIED: true
};

// Géneros de pacientes
export const PATIENT_GENDERS = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
  { value: 'OTRO', label: 'Otro' }
];

// Pisos del hospital (se cargarán dinámicamente desde API)
export const DEFAULT_FLOORS = [
  { id: 1, name: 'P1', label: 'Piso 1' },
  { id: 2, name: 'P2', label: 'Piso 2' },
  { id: 3, name: 'P3', label: 'Piso 3' },
  { id: 4, name: 'P4', label: 'Piso 4' },
  { id: 5, name: 'P5', label: 'Piso 5' }
];

// Roles disponibles para registro
export const AVAILABLE_ROLES = [
  { id: 1, name: 'ROLE_ADMIN', label: 'Administrador' },
  { id: 2, name: 'ROLE_SECRETARIA', label: 'Secretaria' },
  { id: 3, name: 'ROLE_ENFERMERA', label: 'Enfermera' }
];

// Rutas de la aplicación
export const ROUTES = {
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  ADMIN: '/admin',
  SECRETARIA: '/secretaria',
  ENFERMERA: '/enfermera'
};

// Configuración de API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifique su conexión a internet.',
  UNAUTHORIZED: 'No tiene permisos para realizar esta acción.',
  SESSION_EXPIRED: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
  INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos.',
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Formato de email inválido',
  INVALID_USERNAME: 'El usuario debe tener entre 3 y 20 caracteres (letras, números y _)',
  INVALID_PHONE: 'El teléfono debe tener 10 dígitos',
  INVALID_BED_ID: 'El ID de cama debe tener el formato CAMA-XX'
};

// Configuración de localStorage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// Configuración de tabla
export const TABLE_CONFIG = {
  DEFAULT_SORT_ORDER: 'asc',
  DEBOUNCE_DELAY: 300
};

// Expresiones regulares
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PHONE: /^[0-9]{10}$/,
  BED_IDENTIFIER: /^CAMA-\d{2}$/,
  FLOOR_NAME: /^P\d+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  NUMBERS_ONLY: /^[0-9]+$/
};
