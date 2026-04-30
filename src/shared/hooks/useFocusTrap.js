import { useEffect } from 'react';


export const useFocusTrap = (isActive, idModal, onClose) => {
    useEffect(() => {
        if (!isActive) return;

        // Guardamos el elemento que tenia el foco antes de abrir el modal
        const elementoAnterior = document.activeElement;

        const modalElement = document.getElementById(idModal);
        if (!modalElement) return;

        // Selector para encontrar elementos enfocables
        const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';
        
        let focusableElements = Array.from(modalElement.querySelectorAll(focusableElementsString));
        let firstElement;
        let lastElement;

        if (focusableElements.length > 0) {
            firstElement = focusableElements[0];
            lastElement = focusableElements[focusableElements.length - 1];
            // Focuseamos el primer elemento por defecto
            firstElement.focus();
        } else {
            // Si el modal no tuviera elementos enfocables, ponemos el foco en el propio contenedor
            modalElement.focus();
        }

        const handleKeyDown = (e) => {
            // Cerrar con Escape
            if (e.key === 'Escape' && onClose) {
                e.preventDefault();
                onClose();
                return;
            }

            // Atrapar el Tabulador
            if (e.key === 'Tab') {
                if (focusableElements.length === 0) {
                    e.preventDefault();
                    return;
                }

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement || document.activeElement === modalElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // Al desmontar, devolvemos el foco a quien lo abrio
            if (elementoAnterior) {
                elementoAnterior.focus();
            }
        };
    }, [isActive, idModal, onClose]);
};
