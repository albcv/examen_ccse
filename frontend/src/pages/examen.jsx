import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPreguntasPorTipo, guardarResultado } from '../api/examen';

import trofeo from "../img/trofeo.png";          
import aprobado from "../img/aprobado.jpeg";
import desaprobado from "../img/desaprobado.jpeg";

import clockSound from "../audio/clock.wav";
import aciertoSound from "../audio/acierto.wav";
import incorrectoSound from "../audio/incorrecto.wav";
import victorySound from "../audio/victory.wav";
import gameoverSound from "../audio/gameover.wav";

export function Examen() {
  const { tipoId } = useParams();
  const navigate = useNavigate();
  
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const respuestasRef = useRef([]); // Ref para acceder al valor más actual
  const [tiempoRestante, setTiempoRestante] = useState(30);
  const [estadoPregunta, setEstadoPregunta] = useState('respondiendo');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState(null);
  const [mostrarImagenFinal, setMostrarImagenFinal] = useState(false);

  // Referencias de audio
  const clockAudioRef = useRef(null);
  const aciertoAudioRef = useRef(null);
  const incorrectoAudioRef = useRef(null);
  const victoryAudioRef = useRef(null);
  const gameoverAudioRef = useRef(null);

  const timerRef = useRef(null);
  const seleccionTimeoutRef = useRef(null);

  // Inicializar audios
  useEffect(() => {
    clockAudioRef.current = new Audio(clockSound);
    clockAudioRef.current.loop = true;
    aciertoAudioRef.current = new Audio(aciertoSound);
    incorrectoAudioRef.current = new Audio(incorrectoSound);
    victoryAudioRef.current = new Audio(victorySound);
    gameoverAudioRef.current = new Audio(gameoverSound);

    return () => {
      [clockAudioRef, aciertoAudioRef, incorrectoAudioRef, victoryAudioRef, gameoverAudioRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current = null;
        }
      });
    };
  }, []);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const data = await getPreguntasPorTipo(tipoId);
        const dataConBooleans = data.map(p => ({
          ...p,
          opciones: p.opciones.map(o => ({ ...o, es_correcta: Boolean(o.es_correcta) }))
        }));
        const shuffled = shuffleArray(dataConBooleans);
        setPreguntas(shuffled);
        const initialRespuestas = new Array(shuffled.length).fill(null);
        setRespuestas(initialRespuestas);
        respuestasRef.current = initialRespuestas; // sincronizar ref
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las preguntas');
        setLoading(false);
      }
    };
    fetchPreguntas();
  }, [tipoId]);

  // Mantener la ref sincronizada con el estado (opcional, pero útil)
  useEffect(() => {
    respuestasRef.current = respuestas;
  }, [respuestas]);

  // Efecto para controlar la reproducción del clock
  useEffect(() => {
    if (loading || resultado) return;
    const debeSonar = estadoPregunta === 'respondiendo' && tiempoRestante > 0;
    if (debeSonar) {
      if (clockAudioRef.current && clockAudioRef.current.paused) {
        clockAudioRef.current.play().catch(e => console.log('Error clock:', e));
      }
    } else {
      if (clockAudioRef.current && !clockAudioRef.current.paused) {
        clockAudioRef.current.pause();
        clockAudioRef.current.currentTime = 0;
      }
    }
  }, [estadoPregunta, tiempoRestante, loading, resultado]);

  // Efecto para el contador regresivo
  useEffect(() => {
    if (loading || resultado || estadoPregunta !== 'respondiendo') return;

    if (tiempoRestante === 0) {
      // Usar la ref para obtener las respuestas actuales
      const respuestasActuales = respuestasRef.current;
      if (respuestasActuales[preguntaActual] === null) {
        // No hay respuesta: registrar como incorrecta
        const nuevasRespuestas = [...respuestasActuales];
        nuevasRespuestas[preguntaActual] = { opcionId: null, esCorrecta: false };
        setRespuestas(nuevasRespuestas);
        respuestasRef.current = nuevasRespuestas; // actualizar ref
        incorrectoAudioRef.current?.play().catch(e => console.log('Error incorrecto:', e));

        if (preguntaActual + 1 === preguntas.length) {
          calcularResultado(nuevasRespuestas);
        } else {
          handleSiguientePregunta();
        }
      } else {
        // Ya hay respuesta
        if (preguntaActual + 1 === preguntas.length) {
          calcularResultado(respuestasActuales);
        } else {
          handleSiguientePregunta();
        }
      }
      return;
    }

    timerRef.current = setTimeout(() => {
      setTiempoRestante(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [tiempoRestante, loading, resultado, estadoPregunta, preguntaActual, preguntas.length]);

  const handleSeleccionarOpcion = (opcionId, esCorrecta) => {
    if (estadoPregunta !== 'respondiendo') return;

    if (seleccionTimeoutRef.current) clearTimeout(seleccionTimeoutRef.current);

    if (esCorrecta) {
      aciertoAudioRef.current?.play().catch(e => console.log('Error acierto:', e));
    } else {
      incorrectoAudioRef.current?.play().catch(e => console.log('Error incorrecto:', e));
    }

    // Actualizar respuestas: usar el valor actual de la ref y crear nuevo array
    const nuevasRespuestas = [...respuestasRef.current];
    nuevasRespuestas[preguntaActual] = { opcionId, esCorrecta };
    setRespuestas(nuevasRespuestas);
    respuestasRef.current = nuevasRespuestas; // actualizar ref inmediatamente
    setEstadoPregunta(esCorrecta ? 'correcto' : 'incorrecto');

    seleccionTimeoutRef.current = setTimeout(() => {
      handleSiguientePregunta();
    }, 1500);
  };

  const handleSiguientePregunta = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (seleccionTimeoutRef.current) clearTimeout(seleccionTimeoutRef.current);

    if (preguntaActual + 1 < preguntas.length) {
      setPreguntaActual(preguntaActual + 1);
      setTiempoRestante(30);
      setEstadoPregunta('respondiendo');
    } else {
      // Al finalizar, calcular con las respuestas actuales de la ref
      calcularResultado(respuestasRef.current);
    }
  };

  const calcularResultado = (respuestasParaCalcular) => {
    const totalPreguntas = preguntas.length;
    const aciertos = respuestasParaCalcular.filter(r => r && r.esCorrecta).length;
    const calificacion = (aciertos / totalPreguntas) * 100;
    const aprobado = calificacion >= 60;

    setResultado({ calificacion, aprobado, respuestasFinal: respuestasParaCalcular });
    setMostrarImagenFinal(true);

    if (aprobado) {
      victoryAudioRef.current?.play().catch(e => console.log('Error victory:', e));
    } else {
      gameoverAudioRef.current?.play().catch(e => console.log('Error gameover:', e));
    }

    guardarResultado(tipoId, calificacion)
      .then(() => console.log('Resultado guardado'))
      .catch(err => console.error('Error al guardar resultado:', err));
  };

  const handleAbandonar = () => {
    if (window.confirm('¿Estás seguro de que quieres abandonar el examen? Se calculará tu resultado actual.')) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (seleccionTimeoutRef.current) clearTimeout(seleccionTimeoutRef.current);
      if (clockAudioRef.current) {
        clockAudioRef.current.pause();
        clockAudioRef.current.currentTime = 0;
      }
      calcularResultado(respuestasRef.current);
    }
  };

  if (loading) return <div className="text-center py-12">Cargando examen...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  if (resultado && mostrarImagenFinal) {
    let imagen;
    if (resultado.calificacion === 100) {
      imagen = trofeo;
    } else if (resultado.aprobado) {
      imagen = aprobado;
    } else {
      imagen = desaprobado;
    }
    const respuestasFinales = resultado.respuestasFinal || respuestasRef.current;
    const aciertos = respuestasFinales.filter(r => r && r.esCorrecta).length;
    const total = preguntas.length;
    return (
      <div className="min-h-screen bg-yellow-200 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <img src={imagen} alt={resultado.aprobado ? "Aprobado" : "No aprobado"} className="mx-auto mb-6 w-48 h-auto" />
          <h2 className="text-3xl font-bold mb-4">
            {resultado.aprobado ? '¡Aprobado!' : 'No aprobado'}
          </h2>
          <p className="text-xl mb-6">
            Tu calificación: {resultado.calificacion.toFixed(2)}%
          </p>
          <p className="text-lg mb-2">
            Has respondido bien {aciertos} de {total} preguntas.
          </p>
          <p className="mb-8">
            {resultado.aprobado
              ? '¡Felicitaciones! Has superado el examen.'
              : 'Debes mejorar. Sigue practicando.'}
          </p>
          <button
            onClick={() => navigate('/examenes')}
            className="bg-red-700 hover:bg-red-900 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Volver a exámenes
          </button>
        </div>
      </div>
    );
  }

  const pregunta = preguntas[preguntaActual];

  const getOpcionClasses = (opcion) => {
    const isSelected = respuestas[preguntaActual]?.opcionId === opcion.id;
    const isCorrect = opcion.es_correcta;
    let bgColor = 'bg-gray-100';
    if (estadoPregunta !== 'respondiendo') {
      if (isSelected) {
        bgColor = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
      } else if (!isSelected && estadoPregunta === 'incorrecto' && isCorrect) {
        bgColor = 'bg-green-500 text-white';
      }
    }
    return bgColor;
  };

  return (
    <div className="min-h-screen bg-yellow-200 relative">
      <div className="container mx-auto px-4 py-12">
        {/* Encabezado con botón y contador responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <span className="text-2xl font-bold text-gray-800 order-1 sm:order-none">
            Pregunta {preguntaActual + 1} de {preguntas.length}
          </span>
          <button
            onClick={handleAbandonar}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all order-2 sm:order-none mt-2 sm:mt-0"
          >
            Abandonar exámen
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {pregunta.texto}
          </h2>

          <div className="space-y-4">
            {pregunta.opciones.map((opcion) => {
              const isSelected = respuestas[preguntaActual]?.opcionId === opcion.id;
              return (
                <label
                  key={opcion.id}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-red-500' : 'border-gray-300'
                  } ${getOpcionClasses(opcion)}`}
                >
                  <input
                    type="radio"
                    name="opcion"
                    value={opcion.id}
                    disabled={estadoPregunta !== 'respondiendo'}
                    onChange={() => handleSeleccionarOpcion(opcion.id, opcion.es_correcta)}
                    checked={isSelected}
                    className="mr-3"
                  />
                  {opcion.texto}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-4 bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-2xl">
        {tiempoRestante} s
      </div>
    </div>
  );
}