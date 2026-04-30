import { useEffect } from 'react';
import { MiNumero } from '../utils/MiNumero';

export function TecladoBase8({ onTeclaClick, deshabilitado }) {
    // Solo mostramos los botones del 0 al 7 (Base 8)
    const digitos = [0, 1, 2, 3, 4, 5, 6, 7];

    // Efecto para la accesibilidad y uso del teclado fisico
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (deshabilitado) return;
            // Ignorar atajos del navegador
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            // Si el usuario esta escribiendo en un input nativo real, no interferimos
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            const key = e.key.toLowerCase();

            // Numeros del 0 al 7 -> Pasan directos al teclado
            if (['0', '1', '2', '3', '4', '5', '6', '7'].includes(key)) {
                e.preventDefault();
                onTeclaClick(key);
            }

            // Borrar caracter (Backspace o Delete)
            if (key === 'backspace' || key === 'delete') {
                e.preventDefault();
                onTeclaClick('DEL');
            }

            // Borrar todo (Letra C)
            if (key === 'c') {
                e.preventDefault();
                onTeclaClick('CLEAR');
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [onTeclaClick, deshabilitado]); // Dependencia vital para que use la version mas reciente de la funcion

    return (
        <div className="teclado-contenedor">
            <div className="teclado-grid">
                {digitos.map((d) => (
                    <button
                        key={d}
                        className="teclado-btn"
                        tabIndex="-1"
                        onClick={() => onTeclaClick(d.toString())}
                    >
                        {new MiNumero(d, 10).toString()}
                    </button>
                ))}

                {/* Boton delete -> Borrar 1 numero */}
                <button
                    className="teclado-btn accion"
                    onClick={() => onTeclaClick('DEL')}
                    tabIndex="-1"
                    title="Borrar casilla"
                >
                    ⌫
                </button>

                {/* Boton Vaciar Todo (Clear) */}
                <button
                    className="teclado-btn accion"
                    onClick={() => onTeclaClick('CLEAR')}
                    tabIndex="-1"
                    title="Vaciar casilla"
                >
                    C
                </button>
            </div>
        </div>
    );
}