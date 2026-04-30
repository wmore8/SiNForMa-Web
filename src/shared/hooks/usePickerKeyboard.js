import { useCallback } from 'react';

/**
 * Hook para manejar la navegación por teclado en componentes tipo Picker (SwipePicker, MyNumberPicker).
 * Escucha las teclas '+' y '-' además de las flechas Arriba/Abajo.
 * 
 * @param {Function} onSubir Función a ejecutar al pulsar Arriba o '+'
 * @param {Function} onBajar Función a ejecutar al pulsar Abajo o '-'
 * @returns {Function} Manejador onKeyDown para asociar al contenedor
 */
export const usePickerKeyboard = (onArrowUp, onArrowDown, onPlus = onArrowUp, onMinus = onArrowDown) => {
    return useCallback((e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (onArrowUp) onArrowUp();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (onArrowDown) onArrowDown();
        } else if (e.key === '+') {
            e.preventDefault();
            if (onPlus) onPlus();
        } else if (e.key === '-') {
            e.preventDefault();
            if (onMinus) onMinus();
        }
    }, [onArrowUp, onArrowDown, onPlus, onMinus]);
};
