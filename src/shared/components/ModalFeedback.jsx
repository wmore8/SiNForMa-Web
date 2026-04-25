import { Modal } from './Modal';
import { TEXTOS } from '../../constants/textos';

export function ModalFeedback({ isOpen, onClose, esCorrecto, mensaje }) {
    const config = {
        titulo: esCorrecto ? "¡Excelente!" : "¡Casi lo tienes!",
        icono: esCorrecto ? "icon-success" : "icon-warning",
        claseBoton: esCorrecto ? "success" : "danger",
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} titulo={config.titulo} icono={config.icono}>
            <div className="modal-body-centered">
                <p className="modal-text-content">{mensaje}</p>

                <button className={`btn-corregir-full ${config.claseBoton}`} onClick={onClose}>
                    {TEXTOS.global.aceptar}
                </button>
            </div>
        </Modal>
    );
}