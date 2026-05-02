import { ActivityCard } from '../shared/components/ActivityCard';

export function Home() {
    const activities = [
        { id: 1, title: 'Actividad Tablas', icon: 'icon-tablas', path: '/tablas' },
        { id: 2, title: 'Actividad Lapiceros', icon: 'icon-lapiz', path: '/lapiceros' },
        { id: 3, title: 'Actividad Palabras', icon: 'icon-default', path: '/palabras' },
        { id: 4, title: 'Actividad Números', icon: 'icon-default', path: '/numeros' },
        { id: 5, title: 'Actividad Operaciones', icon: 'icon-operaciones', path: '/operaciones' },
        { id: 6, title: 'Actividad Conteo', icon: 'icon-default', path: '/conteo' },
    ];

    return (
        <main className="content-area">
            <div className="cards-grid">
                {activities.map((act) => (
                    <ActivityCard key={act.id} title={act.title} iconName={act.icon} path={act.path} />
                ))}
            </div>
        </main>
    );
}