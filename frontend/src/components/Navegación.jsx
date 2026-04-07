import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { logoutUser } from "../api/auth";

export function Navegación({ isAudioPlaying, toggleAudio }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null); // Referencia al menú desplegable
  const buttonRef = useRef(null); // Referencia al botón que abre el menú

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-yellow-600 to-red-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - área de clic ampliada */}
          <Link to={'/inicio'} className="flex items-center space-x-2 py-2 px-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-red-600 font-bold text-xl">E</span>
            </div>
            <span className="text-white font-bold text-xl">CCSE 2026</span>
          </Link>

          {/* Desktop Navigation - elementos con padding y área de clic ampliada */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to={'/inicio'} className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-medium">
              Inicio
            </Link>
            <Link to={'/examenes'} className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-medium">
              Exámenes
            </Link>
            <Link to={'/resultados'} className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-medium">
              Resultados
            </Link>
            <Link to={'/perfil'} className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-medium">
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Cerrar sesión
            </button>
            <button
              onClick={toggleAudio}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors ml-2"
              aria-label={isAudioPlaying ? "Silenciar" : "Activar sonido"}
            >
              {isAudioPlaying ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0l-2.828 2.828m2.828-2.828l2.828-2.828M12 4v16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414M12 6v12l-4-4H6a2 2 0 01-2-2v-2a2 2 0 012-2h2l4-4z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button - área táctil ampliada */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleAudio}
              className="text-white hover:bg-white/10 p-3 rounded-lg mr-2 transition-colors"
              aria-label={isAudioPlaying ? "Silenciar" : "Activar sonido"}
            >
              {isAudioPlaying ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0l-2.828 2.828m2.828-2.828l2.828-2.828M12 4v16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414M12 6v12l-4-4H6a2 2 0 01-2-2v-2a2 2 0 012-2h2l4-4z" />
                </svg>
              )}
            </button>
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10 p-3 rounded-lg transition-colors"
              aria-label="Menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - con overlay y área táctil ampliada */}
        {isMenuOpen && (
          <>
            {/* Overlay oscuro para cerrar al tocar fuera */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              ref={menuRef}
              className="absolute left-0 right-0 top-16 bg-gradient-to-b from-yellow-600 to-red-700 shadow-lg py-4 px-4 z-50 md:hidden"
            >
              <div className="flex flex-col space-y-2">
                <Link
                  to={'/inicio'}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium text-lg"
                >
                  Inicio
                </Link>
                <Link
                  to={'/examenes'}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium text-lg"
                >
                  Exámenes
                </Link>
                <Link
                  to={'/resultados'}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium text-lg"
                >
                  Resultados
                </Link>
                <Link
                  to={'/perfil'}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium text-lg"
                >
                  Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium text-lg"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}