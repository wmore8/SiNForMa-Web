import { Icon } from './Icon';

// Opciones por defecto para la mayoria de actividades
const NIVELES_DEFAULT = [
    { id: 0, label: "Dificultad Fácil" },
    { id: 1, label: "Dificultad Media" },
    { id: 2, label: "Dificultad Difícil" }
];

export function ActividadControles({
    dificultad,
    onChange,
    onReiniciar,
    onInfoClick,
    opciones = NIVELES_DEFAULT // Si no le pasamos 'opciones', usa las 3 por defecto
}) {
    return (
        <div className="actividad-controles">
            <button className="icon-btn btn-info hover-primary" title="Información" onClick={onInfoClick} >
                <Icon name="icon-info" />
            </button>

            <select value={dificultad} name='dificultad-select' className="dificultad-select" onChange={onChange}>
                {opciones.map(opc => (
                    <option key={opc.id} value={opc.id}>
                        {opc.label}
                    </option>
                ))}
            </select>

            <button className="btn-icon-text hover-danger" onClick={onReiniciar} >
                <Icon name="icon-reset" />
                <span>Reiniciar</span>
            </button>
        </div>
    );
}