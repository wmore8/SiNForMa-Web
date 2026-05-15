import { ActivityCard } from '../shared/components/ActivityCard';

export function Home() {
    const activities = [
        { id: 1, title: 'Actividad Tablas', icon: 'icon-tablas', path: '/tablas' },
        { id: 2, title: 'Actividad Lapiceros', icon: 'icon-lapiz', path: '/lapiceros' },
        { id: 3, title: 'Actividad Palabras', icon: 'icon-palabras', path: '/palabras' },
        { id: 4, title: 'Actividad Números', icon: 'icon-numeros', path: '/numeros' },
        { id: 5, title: 'Actividad Operaciones', icon: 'icon-operaciones', path: '/operaciones' },
        { id: 6, title: 'Actividad Palillos', icon: 'icon-stack', path: '/agrupacion' },
        // { id: 7, title: 'Actividad Reparto', icon: 'icon-split', path: '/conteo', debug: true },
        // { id: 8, title: 'Traductor Palabras', icon: 'icon-brand', path: '/traductor-palabas', debug: true },
        // { id: 9, title: 'Traductor Números', icon: 'icon-brand', path: '/traductor-numeros', debug: true },
    ];

    return (
        <main className="content-area">
            <div className="cards-grid">
                {activities.map((act) => (
                    <ActivityCard key={act.id} title={act.title} iconName={act.icon} path={act.path} debug={act.debug} />
                ))}
            </div>
        </main>
    );
}