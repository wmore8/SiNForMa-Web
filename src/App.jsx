import { Icon } from './components/Icon';
import { Navbar } from './components/Navbar';
import './App.css'

function ActivityCard({ title, iconName }) {
  return (
    <div className="card">
      <div className="card-icon-container">
        <Icon name={iconName} className="card-icon" />
      </div>
      <h2 className="card-title">{title}</h2>
    </div>
  );
}

function App() {
  const activities = [
    { id: 1, title: 'Actividad Tablas', icon: 'icon-default' },
    { id: 2, title: 'Actividad Lapiceros', icon: 'icon-default' },
    { id: 3, title: 'Actividad Palabras', icon: 'icon-default' },
    { id: 4, title: 'Actividad Números', icon: 'icon-default' },
    { id: 5, title: 'Actividad Operaciones', icon: 'icon-default' },
    { id: 6, title: 'Actividad Lorem Ipsum', icon: 'icon-default' },
  ];

  return (
    <div className="main-container">
      <Navbar></Navbar>

      <main className="content-area">
        <div className="cards-grid">
          {activities.map((act) => (
            <ActivityCard key={act.id} title={act.title} iconName={act.icon} />
          ))}
        </div>
      </main>

    </div>
  )
}

export default App