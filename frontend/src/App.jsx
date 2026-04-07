import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Login } from './pages/login';
import { Registro } from './pages/registro';
import { Inicio } from './pages/inicio';
import { Examenes } from './pages/examenes';
import { Perfil } from './pages/perfil';
import { Resultados } from './pages/resultados';
import { Navegación } from './components/Navegación';
import { AudioController } from './components/AudioController';
import { PrivateRoute } from './components/PrivateRoute';
import { Examen } from './pages/examen';

function AppContent() {
  const location = useLocation();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación cada vez que cambia la ruta
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const hideNavigationRoutes = ['/', '/login', '/registro'];
  const shouldHideByPath = hideNavigationRoutes.includes(location.pathname);
  // Mostrar navegación solo si no está en rutas de ocultamiento Y está autenticado
  const shouldShowNavigation = !shouldHideByPath && isAuthenticated;

// El audio de fondo no debe sonar durante el examen 
const isExamenRoute = /^\/examen\/\d+$/.test(location.pathname);
const shouldPlayBackgroundAudio = !shouldHideByPath && isAuthenticated && !isExamenRoute;

  const toggleAudio = () => {
    setIsAudioEnabled(prev => !prev);
  };

  return (
    <div className="min-h-screen">
      <AudioController 
        shouldPlay={shouldPlayBackgroundAudio} 
        isEnabled={isAudioEnabled} 
      />

      {shouldShowNavigation && (
        <Navegación isAudioEnabled={isAudioEnabled} toggleAudio={toggleAudio} />
      )}

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registro' element={<Registro />} />
        
        <Route path='/inicio' element={
          <PrivateRoute>
            <Inicio />
          </PrivateRoute>
        } />
        <Route path='/examenes' element={
          <PrivateRoute>
            <Examenes />
          </PrivateRoute>
        } />
        <Route path='/perfil' element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        } />
        <Route path='/resultados' element={
          <PrivateRoute>
            <Resultados />
          </PrivateRoute>
        } />

        <Route path='/examen/:tipoId' element={
          <PrivateRoute>
            <Examen />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;