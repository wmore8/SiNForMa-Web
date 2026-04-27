import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { OptionsModal } from './shared/components/ModalOptions';
import { Icon } from './shared/components/Icon';
import { Navbar } from './shared/components/Navbar';
import { ActivityCard } from './shared/components/ActivityCard';
import { NotFound } from './pages/NotFound';
import { Home } from './pages/Home';
import { ActividadTablas } from './pages/ActividadTablas';
import { ActividadLapiceros } from './pages/ActividadLapiceros';
import { ActividadPalabras } from './pages/ActividadPalabras';
import { ActividadNumeros } from './pages/ActividadNumeros';
import { ActividadOperaciones } from './pages/ActividadOperaciones';
import { ActividadSuma } from './pages/ActividadSuma';
import { ActividadResta } from './pages/ActividadResta';
import { ActividadMultiplicaciones } from './pages/ActividadMultiplicaciones';
import { ActividadTablasMultiplicar } from './pages/ActividadTablasMultiplicar';
import { ActividadRecortados } from './pages/ActividadRecortados';
import { ActividadCelosia } from './pages/ActividadCelosia';
import { ActividadMultiplicacionClasica } from './pages/ActividadMultiplicacionClasica';
import { ActividadDivisiones } from './pages/ActividadDivisiones';

import './styles/App.css'

function AppLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Uso del LocalStorage: Inicializamos el estado leyendo la memoria del navegador
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme === 'dark'; // Si guardamos 'dark', empieza en true
  });

  // Efecto para aplicar la clase al body cada vez que isDark cambie
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  // Funcion para cambiar el tema y guardarlo
  const toggleTheme = (theme) => {
    setIsDark(theme === 'dark');
    localStorage.setItem('appTheme', theme); // Guardamos la preferencia
  };

  return (
    <div className='main-container'>
      <Navbar onOpenSettings={() => setIsModalOpen(true)} />

      {/* Rutas */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/tablas' element={<ActividadTablas />} />
        <Route path='/lapiceros' element={<ActividadLapiceros />} />
        <Route path='/palabras' element={<ActividadPalabras />} />
        <Route path='/numeros' element={<ActividadNumeros />} />
        <Route path='/operaciones' element={<ActividadOperaciones />} />
        <Route path="/operaciones/suma" element={<ActividadSuma />} />
        <Route path="/operaciones/resta" element={<ActividadResta />} />
        <Route path="/operaciones/divisiones" element={<ActividadDivisiones />} />
        <Route path="/operaciones/multiplicaciones" element={<ActividadMultiplicaciones />} />
        <Route path="/operaciones/multiplicaciones/recortados" element={<ActividadRecortados />} />
        <Route path="/operaciones/multiplicaciones/tablas" element={<ActividadTablasMultiplicar />} />
        <Route path="/operaciones/multiplicaciones/celosia" element={<ActividadCelosia />} />
        <Route path="/operaciones/multiplicaciones/clasico" element={<ActividadMultiplicacionClasica />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <OptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toggleTheme={toggleTheme}
        isDark={isDark}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App