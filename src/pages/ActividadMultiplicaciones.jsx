import { Link } from 'react-router-dom';
import { Header } from '../shared/components/Header';
import { ActivityCard } from '../shared/components/ActivityCard';
import { TEXTOS } from '../constants/textos';

export function ActividadMultiplicaciones() {
    const multiplicaciones = [
        { id: 1, title: TEXTOS.titulos.tablasMultiplicar, icon: 'icon-tablas', path: '/operaciones/multiplicaciones/tablas' },
        { id: 2, title: TEXTOS.titulos.recortados, icon: 'icon-recortados', path: '/operaciones/multiplicaciones/recortados' },
        { id: 3, title: TEXTOS.titulos.celosia, icon: 'icon-celosia', path: '/operaciones/multiplicaciones/celosia' },
        { id: 4, title: TEXTOS.titulos.productoClasico, icon: 'icon-multiplicacion-clasica', path: '/operaciones/multiplicaciones/clasico' },
    ];
    
    return (
        <div className="actividad-layout">
            <Header
                rutas={[
                    { label: TEXTOS.titulos.operaciones, path: '/operaciones', icon: 'icon-operaciones' },
                    { label: TEXTOS.titulos.multiplicaciones, icon: 'icon-multiplicaciones' }
                ]}
                backPath="/operaciones"
            />
           <main className="operaciones-main">
                <div className="cards-grid-4">
                    {multiplicaciones.map((mult) => (
                        <ActivityCard key={mult.id} title={mult.title} iconName={mult.icon} path={mult.path} />
                    ))}
                </div>
            </main>
        </div>
    );
}