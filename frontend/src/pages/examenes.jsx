import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCantidadPreguntas } from '../api/examenes';

export function Examenes() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCantidadPreguntas();
        const examsArray = [
          { id: 1, title: "Tarea 1: Cultura Española", description: "Fundamentos culturales básicos", questions: data.tarea1 },
          { id: 2, title: "Tarea 2: Historia", description: "Historia moderna de España", questions: data.tarea2 },
          { id: 3, title: "Tarea 3: Gobierno", description: "Estructura gubernamental", questions: data.tarea3 },
          { id: 4, title: "Tarea 4: Legislación", description: "Derechos y deberes constitucionales", questions: data.tarea4 },
          { id: 5, title: "Tarea 5: Geografía", description: "Comunidades autónomas y ciudades", questions: data.tarea5 },
          { id: 6, title: "Exámen Aleatorio", description: "Preguntas de todos los temas", questions: data.aleatorio }
        ];
        setExams(examsArray);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los exámenes');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-12">Cargando exámenes...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-yellow-200">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Exámenes Disponibles</h1>
          <p className="text-gray-800 text-lg max-w-3xl mx-auto">
            Selecciona un exámen para comenzar tu práctica. Todos están basados en el temario oficial CCSE 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-yellow-400 rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="p-6 bg-red-800">
                <h3 className="text-xl font-bold text-white">{exam.title}</h3>
                <p className="text-blue-100 mt-2">{exam.description}</p>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-black">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{exam.questions} preguntas</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/examen/${exam.id}`)} 
                  className="w-full bg-red-700 hover:bg-red-900 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                >
                  Comenzar Examen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}