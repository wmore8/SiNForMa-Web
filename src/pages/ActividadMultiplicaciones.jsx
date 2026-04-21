import { Link } from 'react-router-dom';
import { Icon } from '../shared/components/Icon';
import { Header } from '../shared/components/Header';

export function ActividadMultiplicaciones() {
    return (
        <div className="actividad-layout">
            <Header
                rutas={[
                    { label: 'Actividad Operaciones', path: '/operaciones' },
                    { label: 'Multiplicaciones' }
                ]}
                backPath="/operaciones"
            />
            <main className="operaciones-main">
                <div className="cards-grid-4">
                    <Link to="/operaciones/multiplicaciones/tablas" className="card">
                        <Icon name="icon-default" className="card-icon" />
                        <h2>Tablas de multiplicar</h2>
                    </Link>
                    <Link to="/operaciones/multiplicaciones/recortados" className="card">
                        <Icon name="icon-default" className="card-icon" />
                        <h2>Recortados</h2>
                    </Link>
                    <Link to="/operaciones/multiplicaciones/celosia" className="card">
                        <Icon name="icon-default" className="card-icon" />
                        <h2>Celosía</h2>
                    </Link>
                    <Link to="/operaciones/multiplicaciones/clasico" className="card">
                        <Icon name="icon-default" className="card-icon" />
                        <h2>Producto clásico</h2>
                    </Link>
                </div>
            </main>
        </div>
    );
}