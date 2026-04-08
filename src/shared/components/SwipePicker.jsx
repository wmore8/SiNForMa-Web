import { useRef, useEffect } from 'react';
import { MiNumero } from '../utils/MiNumero';
import '../../styles/SwipePicker.css';

export function SwipePicker({ opciones, value, onChange }) {
    const contenedorRef = useRef(null);
    const ITEM_HEIGHT = 60; // Altura en pixeles de cada numero

    // Referencias para evitar el bucle de scroll
    const isProgrammaticScroll = useRef(false);
    const scrollEndTimeout = useRef(null); // para quedarnos con el valor al terminar de scrollear
    const lockTimeout = useRef(null);

    // Escucha el scroll para actualizar el estado en React
    const manejarScroll = () => {
        if (!contenedorRef.current) return;

        // Si el movimiento lo provoco React (por un click o Reiniciar), ignoramos el evento
        if (isProgrammaticScroll.current) return;

        // Limpiamos el temporizador cada vez que el scroll se mueve
        clearTimeout(scrollEndTimeout.current);

        // Si el scroll se detiene durante 100ms, significa que el usuario ha terminado de deslizar
        scrollEndTimeout.current = setTimeout(() => {
            if (!contenedorRef.current) return;

            const scrollTop = contenedorRef.current.scrollTop;
            const indexCalculado = Math.round(scrollTop / ITEM_HEIGHT);

            // Actualizamos React SOLO cuando la ruleta se ha detenido
            if (indexCalculado !== value && indexCalculado >= 0 && indexCalculado < opciones.length) {
                onChange(indexCalculado);
            }
        }, 100);

    };

    // Reacciona cuando cambia el valor desde fuera (Click en un número o Reiniciar)
    useEffect(() => {
        if (contenedorRef.current) {
            const targetScroll = value * ITEM_HEIGHT;
            const currentScroll = contenedorRef.current.scrollTop;

            // Si hay diferencia entre donde estamos y donde debemos estar
            if (Math.abs(currentScroll - targetScroll) > 2) {
                isProgrammaticScroll.current = true; // Bloqueamos el evento táctil

                const diff = Math.abs(currentScroll - targetScroll);
                contenedorRef.current.scrollTo({
                    top: targetScroll,
                    behavior: diff > (ITEM_HEIGHT * 2) ? 'auto' : 'smooth'
                });

                // Desbloqueamos después de que la animación suave haya terminado
                clearTimeout(lockTimeout.current);
                lockTimeout.current = setTimeout(() => {
                    isProgrammaticScroll.current = false;
                }, 400);
            }
        }
    }, [value, opciones.length]);

    // Para permitir seleccionar un numero haciendo click en el
    const handleClickItem = (idx) => {
        if (idx !== value) {
            onChange(idx);
        }
    };

    return (
        <div className="swipe-picker-wrapper">
            <div className="swipe-picker-overlay"></div>
            <div className="swipe-picker-container" ref={contenedorRef} onScroll={manejarScroll} >
                {/* Espacio en blanco arriba para que el primer elemento pueda quedar en el centro */}
                <div className="swipe-padder"></div>

                {opciones.map((opcion, idx) => (
                    <div
                        key={idx}
                        className={`swipe-item ${idx === value ? 'active' : ''}`}
                        onClick={() => handleClickItem(idx)}
                        style={{ cursor: idx !== value ? 'pointer' : 'default' }}
                    >
                        {opcion === ' ' ? '\u00A0' : opcion}
                    </div>
                ))}

                {/* Espacio en blanco abajo para que el ultimo elemento pueda quedar en el centro */}
                <div className="swipe-padder"></div>
            </div>
        </div>
    );
}