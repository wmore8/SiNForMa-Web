import { useCallback } from 'react';

/**
 * Hook para controlar dos SwipePickers acoplados en Base 8 mediante las teclas '+' y '-'
 * 
 * @param {number} idxDecenas - Valor actual de las decenas (0-7)
 * @param {Function} setIdxDecenas - Funcion para actualizar las decenas
 * @param {number} idxUnidades - Valor actual de las unidades (0-7)
 * @param {Function} setIdxUnidades - Funcion para actualizar las unidades
 * @param {Function} onOtherKeyDown - Funcion fallback para otras teclas (ej: handleFlechas)
 * @returns {Function} Funcion para inyectar en el onKeyDown de la cuadricula
 */
export const useControlDoblePicker = (idxDecenas, setIdxDecenas, idxUnidades, setIdxUnidades, onOtherKeyDown) => {
    return useCallback((e, id) => {
        if (e.key === '+') {
            e.preventDefault();
            let val = idxDecenas * 8 + idxUnidades + 1;
            if (val > 63) val = 63; // Limite maximo: 77 en Base 8 (7*8 + 7)
            setIdxDecenas(Math.floor(val / 8));
            setIdxUnidades(val % 8);
        } else if (e.key === '-') {
            e.preventDefault();
            let val = idxDecenas * 8 + idxUnidades - 1;
            if (val < 0) val = 0;
            setIdxDecenas(Math.floor(val / 8));
            setIdxUnidades(val % 8);
        } else if (onOtherKeyDown) {
            onOtherKeyDown(e, id);
        }
    }, [idxDecenas, idxUnidades, setIdxDecenas, setIdxUnidades, onOtherKeyDown]);
};
