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
import { ActividadConteo } from './pages/ActividadConteo';

import './styles/App.css'
import './styles/Accesibilidad.css'
import './styles/Navbar.css'

function AppLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Uso del LocalStorage: Inicializamos el estado leyendo la memoria del navegador
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme === 'dark'; // Si guardamos 'dark', empieza en true
  });

  // Estado para el Modo de Vision
  const [visionMode, setVisionMode] = useState(() => {
    return localStorage.getItem('appVisionMode') || 'protanopia';
  });

  // Estado para darle relleno a la navbar
  const [navFill, setNavFill] = useState(() => {
    return localStorage.getItem('appNavFill') === 'true'
  });

  // Estado para el tamaño de texto
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem('appTextSize') || 'md'; // md por defecto
  });

  // Efecto para aplicar la clase al body cada vez que isDark cambie
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  // Efecto para inyectar la clase del modo de vision en el body
  useEffect(() => {
    // Limpiamos todas las clases de vision posibles para no acumularlas
    document.body.classList.remove(
      'vision-monocromatico',
      'vision-protanopia',
      'vision-deuteranopia',
      'vision-tritanopia'
    );

    // Añadimos la clase del modo actual
    if (visionMode) {
      document.body.classList.add(`vision-${visionMode}`);
    }
  }, [visionMode]);

  // Efecto para inyectar la clase del relleno de la navbar al body
  useEffect(() => {
    if (navFill) {
      document.body.classList.add('nav-filled');
    } else {
      document.body.classList.remove('nav-filled');
    }
  }, [navFill]);

  // Efecto para cambiar el tamaño de letra raiz
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
    html.classList.add(`text-size-${textSize}`);
  }, [textSize]);

  // Funcion para cambiar el tema y guardarlo
  const toggleTheme = (theme) => {
    setIsDark(theme === 'dark');
    localStorage.setItem('appTheme', theme); // Guardamos la preferencia
  };

  // Funcion para cambiar la paleta
  const changeVisionMode = (mode) => {
    setVisionMode(mode);
    localStorage.setItem('appVisionMode', mode);
  };

  // Funcion para rellenar o no la navbar
  const changeNavFill = (filled) => {
    setNavFill(filled);
    localStorage.setItem('appNavFill', filled);
  };

  // Funcion para cambiar tamaño
  const changeTextSize = (size) => {
    setTextSize(size);
    localStorage.setItem('appTextSize', size);
  };

  // Estado para saber si estamos en modo escritorio
  const [isDesktop, setIsDesktop] = useState(false);

  // Efecto para calcular en que tamaño se colapasa la navbar
  useEffect(() => {
    const checkDesktop = () => {
      const width = window.innerWidth;

      if (textSize === 'sm' && width >= 1200) setIsDesktop(true);
      else if (textSize === 'md' && width >= 1350) setIsDesktop(true);
      else if (textSize === 'lg' && width >= 1700) setIsDesktop(true);
      else setIsDesktop(false);
    };

    // Comprobamos al cargar la app y cada vez que cambie el tamaño de la ventana
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    // Limpieza del event listener
    return () => window.removeEventListener('resize', checkDesktop);
  }, [textSize]); // Depende de textSize para recalcularse al instante si mueves el slider

  // Efecto para inyectar al body del HTML
  useEffect(() => {
    if (isDesktop) document.body.classList.add('layout-desktop');
    else document.body.classList.remove('layout-desktop');
  }, [isDesktop]);

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
        <Route path="/conteo" element={<ActividadConteo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <OptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toggleTheme={toggleTheme}
        isDark={isDark}
        textSize={textSize}
        changeTextSize={changeTextSize}
        visionMode={visionMode}
        changeVisionMode={changeVisionMode}
        navFill={navFill}
        changeNavFill={changeNavFill}
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