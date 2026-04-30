import { useEffect } from 'react';

// USO PRINCIPAL PARA ACTIVIDADES CON CELDAS

/**
 * Hook para dar el foco inicial a un elemento concreto al cargar o reiniciar.
 * 
 * @param {any} dependencia - Variable que, al cambiar, dispara el focus (ej: el estado 'ejercicio')
 * @param {string} idElemento - El ID del elemento HTML (sin el '#')
 * @param {Function} onActivar - (Opcional) Funcion a llamar para tu estado local (ej: setCeldaActiva)
 */
export const useAutoFocoInicial = (dependencia, idElemento, onActivar) => {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const elemento = document.getElementById(idElemento);
            if (elemento) {
                elemento.focus();
                // Si el ID tiene tu prefijo 'celda-', se lo quitamos para guardar el ID real en tu estado
                const idLimpio = idElemento.replace('celda-', '');
                if (onActivar) onActivar(idLimpio);
            }
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [dependencia, idElemento, onActivar]);
};