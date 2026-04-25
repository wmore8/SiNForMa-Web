import { useEffect } from 'react';
import { Icon } from './Icon';

export function Modal({ isOpen, onClose, titulo, icono, children }) {
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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className='modal-title'>
                        {icono && <Icon name={icono} />} {titulo}
                    </h2>
                    <button className="icon-btn close-btn hover-danger" onClick={onClose} >
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