import { MiNumero } from '../utils/MiNumero';

export function CeldaInteractiva({
    id,
    valor,          // El valor numerico (0 es espacio vacio)
    textoPersonalizado,    // Para strings completos (Celosia o Recortados)
    isActive,
    feedback = '',  // 'correcta', 'erronea' o ''
    onSelect,       // Funcion al hacer click o focus
    handleFlechas,  // Funcion para mover el foco con las flechas
    claseBase = 'celda-digito interactiva', // clase por defecto
    claseExtra = ''
}) {
    // Detectamos si la celda tiene contenido (ya sea por valor numerico o por string)
    const tieneContenido = textoPersonalizado !== undefined ? textoPersonalizado !== '' : valor > 0;
    const estaLlena = (tieneContenido && feedback === '') ? 'llena' : '';

    return (
        <div
            id={`celda-${id}`}
            className={`${claseBase} ${estaLlena} ${isActive ? 'activa' : ''} ${feedback} ${claseExtra}`}
            onClick={() => onSelect(id)}
            onFocus={() => onSelect(id)}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(id);
                } else if (handleFlechas) {
                    handleFlechas(e, id);
                }
            }}
        >
            {textoPersonalizado !== undefined
                ? textoPersonalizado
                : (valor > 0 ? new MiNumero(valor - 1).toString() : '') //Restamos 1 por el desfase del array de digitos 
            }
        </div>
    );
}