import { useEffect } from 'react';

export const useFocusTrap = (isActive, idModal, onClose) => {

    // EFECTO Foco Inicial (Solo se ejecuta cuando cambia isActive o el ID)
    useEffect(() => {
        if (!isActive) return;

        const modalElement = document.getElementById(idModal);
        if (!modalElement) return;

        // Comprobamos si el foco ya esta dentro del modal para no robarlo
        if (modalElement.contains(document.activeElement)) return;

        const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';
        let focusableElements = Array.from(modalElement.querySelectorAll(focusableElementsString));

        if (focusableElements.length > 0) {
            // Aplicamos el preventScroll para que el navegador no mueva la camara de golpe
            focusableElements[0].focus({ preventScroll: true });
        } else {
            modalElement.focus({ preventScroll: true });
        }
        
    }, [isActive, idModal]); // NO incluimos onClose. Asi no se re-ejecuta.


    // EFECTO Atrapado de Teclado (Se re-ejecuta si cambia onClose, pero no mueve el foco)
    useEffect(() => {
        if (!isActive) return;

        // Guardamos el elemento anterior solo para restaurarlo al cerrar
        const elementoAnterior = document.activeElement;
        const modalElement = document.getElementById(idModal);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && onClose) {
                e.preventDefault();
                onClose();
                return;
            }

            if (e.key === 'Tab') {
                if (!modalElement) return;
                
                const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';
                let focusableElements = Array.from(modalElement.querySelectorAll(focusableElementsString));
                
                if (focusableElements.length === 0) {
                    e.preventDefault();
                    return;
                }

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

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
            // Al desmontar (cerrar modal), devolvemos el foco a quien lo abrio
            // Solo lo devolvemos si realmente estamos cerrando el modal (isActive pasa a false)
            if (elementoAnterior && typeof elementoAnterior.focus === 'function') {
                elementoAnterior.focus({ preventScroll: true });
            }
        };
    }, [isActive, idModal, onClose]); // Este si necesita el onClose para el Escape
};