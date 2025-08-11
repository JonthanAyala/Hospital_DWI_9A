import axiosInstance from './axios';

// Servicios de Autenticación
export const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};

// Servicios de Usuarios
export const userService = {
  getAllUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  registerUser: async (userData) => {
    const response = await axiosInstance.post('/users/register', userData);
    return response.data;
  },

  getUsersByRole: async (role) => {
    const response = await axiosInstance.get(`/users?role=${role}`);
    return response.data;
  },

  transferNurse: async (nurseId, floorId) => {
    const response = await axiosInstance.put(`/users/nurses/${nurseId}/transfer/${floorId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await axiosInstance.put(`/users/update/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/users/delete/${userId}`);
    return response.data;
  },
};

// Servicios de Camas
export const bedService = {
  // Ahora la respuesta de la API se devuelve completa para que el componente la maneje
  getAllBeds: async () => {
    const response = await axiosInstance.get('/beds');
    return response.data;
  },

  getBedsByFloor: async () => {
    const response = await axiosInstance.get('/beds');
    return response.data;
  },

  getAssignedBeds: async () => {
    const response = await axiosInstance.get('/beds/assigned');
    return response.data;
  },

  // **NUEVO MÉTODO AÑADIDO PARA CAMAS DISPONIBLES**
  getAvailableBeds: async () => {
    const response = await axiosInstance.get('/beds/available');
    return response.data;
  },

  registerBed: async (bedData) => {
    const response = await axiosInstance.post('/beds', bedData);
    return response.data;
  },

  assignBed: async (assignmentData) => {
    const response = await axiosInstance.post('/beds/assign', assignmentData);
    return response.data;
  },
  
  updateBed: async (bedId, bedData) => {
    const response = await axiosInstance.put(`/beds/${bedId}`, bedData);
    return response.data;
  },

  deleteBed: async (bedId) => {
    const response = await axiosInstance.delete(`/beds/${bedId}`);
    return response.data;
  }
};

// Servicios de Pacientes
export const patientService = {
  getAllPatients: async () => {
    const response = await axiosInstance.get('/patients');
    return response.data;
  },
  // **AQUÍ ESTÁ EL MÉTODO QUE FALTABA**
  getPatientsByNurse: async () => {
    const response = await axiosInstance.get('/patients/by-nurse');
    return response.data;
  },
  getPatientById: async (patientId) => {
    const response = await axiosInstance.get(`/patients/${patientId}`);
    return response.data;
  },

  registerPatient: async (patientData) => {
    const response = await axiosInstance.post('/patients', patientData);
    return response.data;
  },

  dischargePatient: async (patientId) => {
    const response = await axiosInstance.put(`/patients/${patientId}/discharge`);
    return response.data;
  }
};

// Servicios de Roles
export const roleService = {
  getAllRoles: async () => {
    const response = await axiosInstance.get('/roles');
    return response.data;
  }
};

// Servicios de Pisos
export const floorService = {
  getAllFloors: async () => {
    const response = await axiosInstance.get('/floors');
    return response.data;
  },
  createFloor: async (data) => {
    const response = await axiosInstance.post('/floors', data);
    return response;
  },
  updateFloor: async (id, data) => {
    const response = await axiosInstance.put(`/floors/${id}`, data);
    return response;
  },
  deleteFloor: async (id) => {
    const response = await axiosInstance.delete(`/floors/${id}`);
    return response.data;
  }
};