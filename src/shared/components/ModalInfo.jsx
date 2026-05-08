import { Modal } from './Modal';
import { TEXTOS } from '../../constants/textos';

export function ModalInfo({ isOpen, onClose, mensaje }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} titulo={TEXTOS.infoActividades.titulo} icono="icon-info">
            <div className="modal-body-centered">
                <p className="modal-text-content"> {mensaje} </p>

                <button className="btn-corregir-full hover-primary" onClick={onClose}>
                    {TEXTOS.global.aceptar}
                </button>
            </div>
        </Modal>
    );
}