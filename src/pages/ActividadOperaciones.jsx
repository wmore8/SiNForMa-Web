import { Link } from 'react-router-dom';
import { Icon } from '../shared/components/Icon';
import { Header } from '../shared/components/Header';
import '../styles/ActividadOperaciones.css'

export function ActividadOperaciones() {
    return (
        <div className="actividad-layout">
            <Header rutas={[ { label: 'Actividad operaciones' } ]} backPath="/"/>
            <main className="operaciones-main">
                <div className="cards-grid-4">
                    <Link to="/operaciones/suma" className="card">
                        <Icon name="icon-default" className="card-icon" />
                        <h2>Suma</h2>
                    </Link>
                    <Link to="/operaciones/resta" className="card">
                        <Icon name="icon-default" className="card-icon" />
                        <h2>Resta</h2>
                    </Link>
                    <Link to="/operaciones/producto" className="card">
                        <Icon name="icon-default" className="card-icon" />
                        <h2>Multiplicaciones</h2>
                    </Link>
                    <Link to="/operaciones/divisiones" className="card">
                        <Icon name="icon-default" className="card-icon" />
                        <h2>Divisiones</h2>
                    </Link>
                </div>
            </main>
        </div>
    );
}