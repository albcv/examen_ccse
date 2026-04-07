import axios from './axios';

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`/login/`, { username, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.Error || 'Error en el login');
    } else if (error.request) {
      throw new Error('No se pudo conectar al servidor');
    } else {
      throw new Error('Error al enviar la petición');
    }
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`/register/`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw new Error('No se pudo conectar al servidor');
    } else {
      throw new Error('Error al enviar la petición');
    }
  }
};

export const logoutUser = async () => {
  try {
   
    await axios.post('/logout/');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error al cerrar sesión', error);
    // Asegurar limpieza incluso si falla la petición
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};