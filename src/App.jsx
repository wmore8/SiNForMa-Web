import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Icon } from './components/Icon';
import { Navbar } from './components/Navbar';
import './App.css'

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
    { id: 2, title: 'Actividad Lapiceros', icon: 'icon-default', path: '/lapiceros' },
    { id: 3, title: 'Actividad Palabras', icon: 'icon-default', path: '/palabras' },
    { id: 4, title: 'Actividad Números', icon: 'icon-default', path: '/numeros' },
    { id: 5, title: 'Actividad Operaciones', icon: 'icon-default', path: '/operacioness' },
    { id: 6, title: 'Actividad Lorem Ipsum', icon: 'icon-default', path: '/lorem' },
  ];

  return (
      <main className="content-area">
        <div className="cards-grid">
          {activities.map((act) => (
            <ActivityCard key={act.id} title={act.title} iconName={act.icon} path={act.path}/>
          ))}
        </div>
      </main>
  )
}

function ActividadTablas() {
  return (
    <main className="content-area">
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1>Actividad Tablas</h1>
        <p>Aun en desarrollo...</p>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Volver al inicio</Link>
      </div>
    </main>
  );
}


function App() {
  return (
    <BrowserRouter>
      <div className='main-container'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/tablas' element={<ActividadTablas />} />
          <Route path="*" element={<main className="content-area"><h1>Página no encontrada</h1></main>} />
        </Routes>
      </div>
    </BrowserRouter>
  );

}

export default App