import { Link } from "react-router-dom";
import bandera from "../img/bandera.png";       
import mapaPolitico from "../img/mapa_político.png";
import mapaFisico from "../img/mapa_físico.jpg";

export function Inicio() {
  return (
    <div className="min-h-screen bg-gradient-to-b bg-yellow-200 relative overflow-hidden">
     
      <img 
        src={bandera} 
        alt="Bandera" 
        className="absolute top-0 left-0 w-40 sm:w-48 md:w-56 lg:w-64 h-auto z-0" 
      />
      <img 
        src={mapaPolitico} 
        alt="Mapa político" 
        className="absolute top-0 right-0 w-40 sm:w-48 md:w-56 lg:w-64 h-auto z-0" 
      />
      <img 
        src={mapaFisico} 
        alt="Mapa físico" 
        className="absolute left-0 bottom-0 w-40 sm:w-48 md:w-56 lg:w-64 h-auto z-0" 
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-600 to-red-600 rounded-2xl mb-6">
            <span className="text-white font-bold text-4xl">E</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-600">Exámen CCSE 2026</span>
          </h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            La plataforma definitiva para prepararte para el exámen de Conocimientos Constitucionales y Socioculturales de España
          </p>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto md:ml-80">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-100 rounded-xl p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Realiza exámenes</h3>
              <p className="text-gray-600">Accede a nuestra amplia biblioteca de exámenes prácticos simulando las condiciones reales.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Revisa resultados</h3>
              <p className="text-gray-600">Analiza tu progreso con estadísticas detalladas y recomendaciones personalizadas.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/examenes"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-600 to-red-600 text-white font-semibold rounded-xl hover:from-yellow-700 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            Comenzar ahora
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}