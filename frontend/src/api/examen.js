import axios from './axios';

export const getPreguntasPorTipo = async (tipoId) => {
  try {
    const response = await axios.get(`/preguntas/tipo/${tipoId}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    throw error;
  }
};

export const guardarResultado = async (tipoExamenId, calificacion) => {
  try {
    const response = await axios.post('/guardar-resultado/', {
      tipo_examen_id: tipoExamenId,
      calificacion: calificacion
    });
    return response.data;
  } catch (error) {
    console.error('Error al guardar resultado:', error);
    throw error;
  }
};