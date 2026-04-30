import { useCallback } from 'react';

/**
 * Hook para navegar por cuadriculas usando las flechas del teclado.
 * 
 * @param {Array<Array<string|null>>} gridMap - Matriz 2D con los IDs de las celdas.
 * @param {Function} onActivarCelda - (Opcional) Funcion a ejecutar cuando se enfoca una nueva celda (ej: setCeldaActiva)
 * @returns {Function} Funcion handleFlechas para inyectar en el onKeyDown
 */
export const useNavegacionFlechas = (gridMap, onActivarCelda, deshabilitado = false) => {

    return useCallback((e, idActual) => {
        // En el caso de que no queramos que se puedan usar las teclas (Cuando salga un modal por ejemplo)
        if (deshabilitado) return;

        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

        // 1. Encontrar en que fila y columna estamos
        let fActual = -1, cActual = -1;
        for (let i = 0; i < gridMap.length; i++) {
            const index = gridMap[i].indexOf(idActual);
            if (index !== -1) {
                fActual = i;
                cActual = index;
                break;
            }
        }

        if (fActual === -1) return; // Salimos si no encuentra la celda

        let nuevaFila = fActual;
        let nuevaCol = cActual;

        // 2. Calcular nueva posicion
        if (e.key === 'ArrowUp') nuevaFila = Math.max(0, fActual - 1);
        if (e.key === 'ArrowDown') nuevaFila = Math.min(gridMap.length - 1, fActual + 1);
        if (e.key === 'ArrowLeft') nuevaCol = Math.max(0, cActual - 1);
        if (e.key === 'ArrowRight') nuevaCol = Math.min(gridMap[0].length - 1, cActual + 1);

        // 3. Si nos hemos movido a una casilla diferente y valida
        if (nuevaFila !== fActual || nuevaCol !== cActual) {
            let nuevoId = gridMap[nuevaFila][nuevaCol];

            if (!nuevoId && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                // Buscamos la primera celda válida en esa fila
                for (let i = 0; i < gridMap[nuevaFila].length; i++) {
                    if (gridMap[nuevaFila][i] !== null) {
                        nuevoId = gridMap[nuevaFila][i];
                        break;
                    }
                }
            }

            // Si es un hueco vacío moviéndose horizontalmente (o si la fila entera estaba vacía)
            if (!nuevoId) return;

            // Si es un hueco vacio, no hacemos nada
            if (!nuevoId) return;

            e.preventDefault(); // Evitamos que la pantalla haga scroll al usar las flechas

            // Movemos el focus real de HTML
            const elementoDestino = document.getElementById(`celda-${nuevoId}`);
            if (elementoDestino) {
                elementoDestino.focus();
                // Si nos pasaron la funcion (como setCeldaActiva), la ejecutamos
                if (onActivarCelda) onActivarCelda(nuevoId);
            }
        }
    }, [gridMap, onActivarCelda, deshabilitado]);
};