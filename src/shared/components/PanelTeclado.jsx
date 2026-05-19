import { TecladoBase } from './TecladoBase';
import { TEXTOS } from '../../constants/textos';

// Componente que sirve para utilizar el teclado en el panel derecho
export function PanelTeclado({ onTeclaClick, onCorregir, handleFlechas, deshabilitado = false }) {
    return (
        <div className="panel-derecho-dificil">
            <TecladoBase onTeclaClick={onTeclaClick} deshabilitado={deshabilitado} />
            <button
                id="celda-btn-corregir"
                className="btn-corregir-full hover-primary"
                onClick={onCorregir}
                disabled={deshabilitado}
                onKeyDown={(e) => {
                    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                        handleFlechas(e, 'btn-corregir');
                    }
                }}>
                {TEXTOS.global.corregir}
            </button>
        </div>
    );
}