import { MiNumero } from '../utils/MiNumero';

export function TecladoBase8({ onTeclaClick }) {
    // Solo mostramos los botones del 0 al 7 (Base 8)
    const digitos = [0, 1, 2, 3, 4, 5, 6, 7];

    return (
        <div className="teclado-contenedor">
            <div className="teclado-grid">
                {digitos.map((d) => (
                    <button 
                        key={d} 
                        className="teclado-btn" 
                        onClick={() => onTeclaClick(d.toString())}
                    >
                        {new MiNumero(d, 10).toString()}
                    </button>
                ))}
                
                {/* Boton delete -> Borrar 1 numero */}
                <button 
                    className="teclado-btn accion" 
                    onClick={() => onTeclaClick('DEL')}
                    title="Borrar casilla"
                >
                    ⌫
                </button>
                
                {/* Boton Vaciar Todo (Clear) */}
                <button 
                    className="teclado-btn accion" 
                    onClick={() => onTeclaClick('CLEAR')}
                    title="Vaciar casilla"
                >
                    C
                </button>
            </div>
        </div>
    );
}