import { useCallback } from 'react';
import { MiNumero } from '../utils/MiNumero';

/**
 * Hook para controlar dos SwipePickers acoplados en la base dinamica mediante las teclas '+' y '-'
 * 
 * @param {number} idxDecenas - Valor actual de las decenas
 * @param {Function} setIdxDecenas - Funcion para actualizar las decenas
 * @param {number} idxUnidades - Valor actual de las unidades
 * @param {Function} setIdxUnidades - Funcion para actualizar las unidades
 * @param {Function} onOtherKeyDown - Funcion fallback para otras teclas (ej: handleFlechas)
 * @returns {Function} Funcion para inyectar en el onKeyDown de la cuadricula
 */
export const useControlDoblePicker = (idxDecenas, setIdxDecenas, idxUnidades, setIdxUnidades, onOtherKeyDown) => {
    return useCallback((e, id) => {
        const base = MiNumero.baseActual;
        const limit = base * base - 1; // Ej: 63 en Base 8 (77), 99 en Base 10 (99)

        if (e.key === '+') {
            e.preventDefault();
            let val = idxDecenas * base + idxUnidades + 1;
            if (val > limit) val = limit;
            setIdxDecenas(Math.floor(val / base));
            setIdxUnidades(val % base);
        } else if (e.key === '-') {
            e.preventDefault();
            let val = idxDecenas * base + idxUnidades - 1;
            if (val < 0) val = 0;
            setIdxDecenas(Math.floor(val / base));
            setIdxUnidades(val % base);
        } else if (onOtherKeyDown) {
            onOtherKeyDown(e, id);
        }
    }, [idxDecenas, idxUnidades, setIdxDecenas, setIdxUnidades, onOtherKeyDown]);
};
