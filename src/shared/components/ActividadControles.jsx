import { Icon } from './Icon';
import { MiNumero } from '../utils/MiNumero';

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
    opciones = NIVELES_DEFAULT, // Si no le pasamos 'opciones', usa las 3 por defecto
    mostrarToggleInput,
    inputMode,
    onToggleInputMode,
}) {
    return (
        <div className="actividad-controles">

            {MiNumero.baseActual !== 8 && (
                <button className="btn-icon-text hover-primary" title="Información" onClick={onInfoClick} >
                    <Icon name="icon-info" />
                    <span className='btn-text action'>Información</span>
                </button>
            )}

            {mostrarToggleInput && (
                <button
                    className="btn-icon-text hover-primary btn-toggle"
                    onClick={onToggleInputMode}
                    title={inputMode === 'picker' ? "Usar Teclado Numérico" : "Usar Ruedas de Selección"}
                    aria-label={inputMode === 'picker' ? "Cambiar a teclado" : "Cambiar a ruedas"}
                >
                    <Icon name={inputMode === 'picker' ? "icon-keyboard" : "icon-swipe"} />
                    <span className='btn-text action'>Entrada</span>
                </button>
            )}

            <select value={dificultad} name='dificultad-select' className="dificultad-select" onChange={onChange}>
                {opciones.map(opc => (
                    <option key={opc.id} value={opc.id}>
                        {opc.label}
                    </option>
                ))}
            </select>

            <button className="btn-icon-text hover-danger" title='Reiniciar' onClick={onReiniciar} >
                <Icon name="icon-reset" />
                <span className='btn-text action'>Reiniciar</span>
            </button>
        </div>
    );
}