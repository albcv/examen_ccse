import { useState, useEffect } from 'react';
import { getMisResultados, borrarHistorial } from '../api/resultados';

export function Resultados() {
  const [resultados, setResultados] = useState([]);
  const [stats, setStats] = useState({
    averageScore: 0,
    examsTaken: 0,
    bestScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getMisResultados();
      setResultados(data.resultados);
      setStats(data.stats);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los resultados');
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    setDeleting(true);
    try {
      await borrarHistorial();
      setResultados([]);
      setStats({ averageScore: 0, examsTaken: 0, bestScore: 0 });
      setShowConfirm(false);
    } catch (err) {
      setError('Error al borrar el historial');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Cargando resultados...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-yellow-200">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Resultados de Exámenes</h1>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Revisa tu desempeño histórico y sigue tu progreso de aprendizaje
          </p>
        </div>

        {/* Botón para vaciar historial - centrado en móvil, derecha en desktop */}
        <div className="flex justify-center md:justify-end mb-6">
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            Vaciar historial
          </button>
        </div>

        {/* Modal de confirmación */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">¿Estás seguro?</h3>
              <p className="mb-6">Esta acción eliminará permanentemente todos tus resultados. No se puede deshacer.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  disabled={deleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={deleting}
                >
                  {deleting ? 'Eliminando...' : 'Sí, vaciar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overall Stats - sin margen izquierdo en móvil, con margen en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 ml-0 md:ml-60">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.averageScore}%</div>
            <div className="text-gray-700 font-medium">Puntuación Promedio</div>
            <p className="text-gray-500 text-sm mt-2">Basado en todos tus exámenes</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.examsTaken}</div>
            <div className="text-gray-700 font-medium">Exámenes Realizados</div>
            <p className="text-gray-500 text-sm mt-2">Total de pruebas completadas</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.bestScore}%</div>
            <div className="text-gray-700 font-medium">Mejor Puntuación</div>
            <p className="text-gray-500 text-sm mt-2">Tu mejor resultado histórico</p>
          </div>
        </div>

        {/* Results Table - sin margen izquierdo en móvil, con margen en desktop */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden ml-0 md:ml-40">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Historial de Exámenes</h2>
          </div>
          
          <div className="overflow-x-auto">
            {resultados.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No hay resultados para mostrar.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Examen</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Puntuación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {resultados.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50 transition-colors duration-300">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{result.examen}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{result.fecha}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`font-bold ${
                            result.calificacion >= 80 ? 'text-green-600' : 
                            result.calificacion >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {result.calificacion}/100
                          </span>
                          <div className="ml-3 w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                result.calificacion >= 80 ? 'bg-green-600' : 
                                result.calificacion >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${result.calificacion}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}