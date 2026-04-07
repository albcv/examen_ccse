import axios from './axios';

export const getCantidadPreguntas = async () => {
  try {
    const response = await axios.get('/cantidad-preguntas/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener cantidad de preguntas:', error);
    throw error;
  }
};