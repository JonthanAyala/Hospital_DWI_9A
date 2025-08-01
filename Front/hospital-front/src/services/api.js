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
  }
};

// Servicios de Camas
export const bedService = {
  getAllBeds: async () => {
    const response = await axiosInstance.get('/beds');
    return response.data;
  },

  getBedsByFloor: async (floorId) => {
    const response = await axiosInstance.get(`/beds?floorId=${floorId}`);
    return response.data;
  },

  getAssignedBeds: async () => {
    const response = await axiosInstance.get('/beds/assigned');
    return response.data;
  },

  registerBed: async (bedData) => {
    const response = await axiosInstance.post('/beds', bedData);
    return response.data;
  },

  assignBed: async (assignmentData) => {
    const response = await axiosInstance.post('/beds/assign', assignmentData);
    return response.data;
  }
};

// Servicios de Pacientes
export const patientService = {
  getAllPatients: async () => {
    const response = await axiosInstance.get('/patients');
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
  }
};
