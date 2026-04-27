import { Link } from 'react-router-dom';
import { Header } from '../shared/components/Header';
import { ActivityCard } from '../shared/components/ActivityCard';
import { TEXTOS } from '../constants/textos';
import '../styles/ActividadOperaciones.css'

export function ActividadOperaciones() {
    const operaciones = [
        { id: 1, title: TEXTOS.titulos.suma, icon: 'icon-default', path: '/operaciones/suma' },
        { id: 2, title: TEXTOS.titulos.resta, icon: 'icon-default', path: '/operaciones/resta' },
        { id: 3, title: TEXTOS.titulos.multiplicaciones, icon: 'icon-default', path: '/operaciones/multiplicaciones' },
        { id: 4, title: TEXTOS.titulos.divisiones, icon: 'icon-default', path: '/operaciones/divisiones' },
    ];
    return (
       <div className="actividad-layout operaciones-layout">
            <Header rutas={[{ label: 'Actividad operaciones' }]} backPath="/" />
            <main className="operaciones-main">
                <div className="cards-grid-4">
                    {operaciones.map((op) => (
                        <ActivityCard key={op.id} title={op.title} iconName={op.icon} path={op.path} />
                    ))}
                </div>
            </main>
        </div>
    );
}