import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { OptionsModal } from './shared/components/OptionsModal';
import { Icon } from './shared/components/Icon';
import { Navbar } from './shared/components/Navbar';
import { ActividadTablas } from './pages/ActividadTablas';
import { ActividadLapiceros } from './pages/ActividadLapiceros';
import { ActividadPalabras } from './pages/ActividadPalabras';
import { ActividadNumeros } from './pages/ActividadNumeros';
import { ActividadOperaciones } from './pages/ActividadOperaciones';
import { ActividadSuma } from './pages/ActividadSuma';
import { ActividadResta } from './pages/ActividadResta';
import { ActividadMultiplicaciones } from './pages/ActividadMultiplicaciones';
import { ActividadRecortados } from './pages/ActividadRecortados';
import { ActividadMultiplicacionClasica } from './pages/ActividadMultiplicacionClasica';
import { ActividadDivisiones } from './pages/ActividadDivisiones';

import './styles/App.css'

function ActivityCard({ title, iconName, path }) {
  return (
    <Link to={path} className="card">
      <div className="card-icon-container">
        <Icon name={iconName} className="card-icon" />
      </div>
      <h2 className="card-title">{title}</h2>
    </Link>
  );
}

function Home() {
  const activities = [
    { id: 1, title: 'Actividad Tablas', icon: 'icon-default', path: '/tablas' },
    { id: 2, title: 'Actividad Lapiceros', icon: 'icon-lapiz', path: '/lapiceros' },
    { id: 3, title: 'Actividad Palabras', icon: 'icon-default', path: '/palabras' },
    { id: 4, title: 'Actividad Números', icon: 'icon-default', path: '/numeros' },
    { id: 5, title: 'Actividad Operaciones', icon: 'icon-default', path: '/operaciones' },
    { id: 6, title: 'Actividad Lorem Ipsum', icon: 'icon-default', path: '/lorem' },
  ];

  return (
    <main className="content-area">
      <div className="cards-grid">
        {activities.map((act) => (
          <ActivityCard key={act.id} title={act.title} iconName={act.icon} path={act.path} />
        ))}
      </div>
    </main>
  )
}


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
        {/* <Route path="/operaciones/multiplicaciones/tablas" element={<ActividadProductoTablas />} />
        <Route path="/operaciones/multiplicaciones/celosia" element={<ActividadProductoCelosia />} />*/}
        <Route path="/operaciones/multiplicaciones/clasico" element={<ActividadMultiplicacionClasica />} />
        <Route path="*" element={<main className="content-area"><h1>Página no encontrada</h1></main>} />
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