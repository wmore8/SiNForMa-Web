import { useState, useCallback } from 'react';
import { MiNumero } from '../utils/MiNumero';

export function useTecladoCeldas(celdaActiva) {
    const [valoresCeldas, setValoresCeldas] = useState({});
    const [feedbackCeldas, setFeedbackCeldas] = useState({});

    const limpiarCeldas = useCallback(() => {
        setValoresCeldas({});
        setFeedbackCeldas({});
    }, []);

    const handleKeyPress = useCallback((tecla) => {
        if (tecla === 'CLEAR') {
            limpiarCeldas();
            return;
        }
        
        if (!celdaActiva) return;

        // Quitamos el color rojo/verde al empezar a editar
        setFeedbackCeldas(prev => ({ ...prev, [celdaActiva]: '' }));

        let valNuevo;
        if (tecla === 'DEL' || tecla === 'borrar') {
            valNuevo = 0; // Vaciamos la celda
        } else {
            valNuevo = parseInt(tecla, MiNumero.baseActual) + 1;
        }

        setValoresCeldas(prev => ({ ...prev, [celdaActiva]: valNuevo }));
    }, [celdaActiva, limpiarCeldas]);

    return {
        valoresCeldas,
        setValoresCeldas, // Exportado por si los SwipePickers necesitan modificarlo directamente
        feedbackCeldas,
        setFeedbackCeldas,
        handleKeyPress,
        limpiarCeldas
    };
}