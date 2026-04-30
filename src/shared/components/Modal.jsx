import { useEffect } from 'react';
import { Icon } from './Icon';
import { useFocusTrap } from '../hooks/useFocusTrap';

export function Modal({ isOpen, onClose, titulo, icono, children, id = "modal-principal" }) {
    // Atrapa el foco dentro del modal
    useFocusTrap(isOpen, id, onClose);

    // EFECTO PARA BLOQUEAR EL SCROLL
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Limpieza al desmontar el componente (importante si el usuario navega atras)
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                id={id}
                className="modal-content" 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex="-1"
            >
                <div className="modal-header">
                    <h2 id="modal-title" className='modal-title'>
                        {icono && <Icon name={icono} />} {titulo}
                    </h2>
                    <button className="icon-btn close-btn hover-danger" onClick={onClose} aria-label="Cerrar modal">
                        <Icon name="icon-close" />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}