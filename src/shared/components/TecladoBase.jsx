import { useEffect } from 'react';
import { MiNumero } from '../utils/MiNumero';

export function TecladoBase({ onTeclaClick, deshabilitado }) {
    const base = MiNumero.baseActual;
    const digitos = Array.from({ length: base }, (_, i) => i);

    // Configuramos el orden de los botones dependiendo de la base
    let botonesConfig = [];
    if (base === 10) {
        botonesConfig = [
            { id: '1', display: new MiNumero(1, 10).toString() },
            { id: '2', display: new MiNumero(2, 10).toString() },
            { id: '3', display: new MiNumero(3, 10).toString() },
            { id: '4', display: new MiNumero(4, 10).toString() },
            { id: '5', display: new MiNumero(5, 10).toString() },
            { id: '6', display: new MiNumero(6, 10).toString() },
            { id: '7', display: new MiNumero(7, 10).toString() },
            { id: '8', display: new MiNumero(8, 10).toString() },
            { id: '9', display: new MiNumero(9, 10).toString() },
            { id: '0', display: new MiNumero(0, 10).toString(), clase: 'btn-cero' },
            { id: 'DEL', display: '⌫', clase: 'accion btn-del', title: 'Borrar casilla' },
            { id: 'CLEAR', display: 'C', clase: 'accion btn-clear', title: 'Vaciar casilla' }
        ];
    } else {
        botonesConfig = [
            ...digitos.map(d => ({ id: d.toString(), display: new MiNumero(d, 10).toString() })),
            { id: 'DEL', display: '⌫', clase: 'accion', title: 'Borrar casilla' },
            { id: 'CLEAR', display: 'C', clase: 'accion', title: 'Vaciar casilla' }
        ];
    }

    // Efecto para la accesibilidad y uso del teclado fisico
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (deshabilitado) return;
            // Ignorar atajos del navegador
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            // Si el usuario esta escribiendo en un input nativo real, no interferimos
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            const key = e.key.toLowerCase();
            const teclasValidas = digitos.map(d => d.toString());

            // Numeros validos para la base -> Pasan directos al teclado
            if (teclasValidas.includes(key)) {
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
        <div className={`teclado-contenedor base-${base}`}>
            <div className="teclado-grid">
                {botonesConfig.map((btn) => (
                    <button
                        key={btn.id}
                        className={`teclado-btn ${btn.clase || ''}`}
                        tabIndex="-1"
                        title={btn.title}
                        onClick={() => onTeclaClick(btn.id)}
                    >
                        {btn.display}
                    </button>
                ))}
            </div>
        </div>
    );
}