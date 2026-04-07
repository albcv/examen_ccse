import axios from './axios';

export const getMisResultados = async () => {
  try {
    const response = await axios.get('/mis-resultados/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener resultados:', error);
    throw error;
  }
};

export const borrarHistorial = async () => {
  try {
    const response = await axios.delete('/borrar-historial/');
    return response.data;
  } catch (error) {
    console.error('Error al borrar historial:', error);
    throw error;
  }
};