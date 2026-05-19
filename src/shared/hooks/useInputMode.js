import { useState, useCallback } from 'react';

export function useInputMode(defaultMode = 'picker') {
    const [inputMode, setInputMode] = useState(defaultMode);
    const [activeCellId, setActiveCellId] = useState(null);

    const toggleInputMode = useCallback(() => {
        setInputMode(prev => prev === 'picker' ? 'keyboard' : 'picker');
        // Al cambiar de modo, quitamos el foco de cualquier casilla
        setActiveCellId(null); 
    }, []);

    return {
        inputMode,
        toggleInputMode,
        activeCellId,
        setActiveCellId
    };
}