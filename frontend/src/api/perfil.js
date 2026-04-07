import axios from './axios';

export const getPerfil = async () => {
  try {
    const response = await axios.get('/perfil/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};

export const cambiarPassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.post('/cambiar-password/', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Error al cambiar contraseña');
    } else {
      throw new Error('Error de conexión');
    }
  }
};