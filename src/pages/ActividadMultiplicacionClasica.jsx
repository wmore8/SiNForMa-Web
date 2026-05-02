import { useState, useCallback } from 'react';
import { SwipePicker } from '../shared/components/SwipePicker';
import { TecladoBase } from '../shared/components/TecladoBase';
import { MiNumero } from '../shared/utils/MiNumero';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { TEXTOS } from '../constants/textos';
import { useNavegacionFlechas } from '../shared/hooks/useNavegacionFlechas';
import { useAutoFocoInicial } from '../shared/hooks/useAutoFocoInicial';
import '../styles/ActividadOperaciones.css';

const OPCIONES_DIGITOS = [' ', ...MiNumero.losDigitos];

const generarMultiplicacion = (nivel) => {
    const base = MiNumero.baseActual;
    const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    let val1 = 0;
    let val2 = 0;

    if (nivel === '0') {
        val1 = rand(0, base); val2 = rand(0, base);
    } else if (nivel === '1') {
        val1 = rand(0, Math.pow(base, 3)); val2 = rand(0, base);
    } else {
        // Dificil: 3 cifras x 3 cifras
        val1 = rand(Math.pow(base, 2), Math.pow(base, 3));
        val2 = rand(Math.pow(base, 2), Math.pow(base, 3));
    }

    const str1BaseActual = val1.toString(base);
    // Para el nivel 2, necesitamos que el multiplicador siempre tenga 3 cifras en texto (ej. "124")
    const str2BaseActual = val2.toString(base).padStart(3, '0');

    // Calculamos las soluciones parciales (cada fila de la multiplicacion larga)
    const digitoU = parseInt(str2BaseActual[2], base);
    const digitoD = parseInt(str2BaseActual[1], base);
    const digitoC = parseInt(str2BaseActual[0], base);

    // Los productos parciales tienen como maximo 4 cifras. Los rellenamos con espacios a la izquierda.
    const paso0 = (val1 * digitoU).toString(base).padStart(4, ' ');
    const paso1 = (val1 * digitoD).toString(base).padStart(4, ' ');
    const paso2 = (val1 * digitoC).toString(base).padStart(4, ' ');

    // El resultado final tiene como maximo 6 cifras.
    const resultadoFinal = (val1 * val2).toString(base).padStart(6, ' ');

    return {
        num1Str: str1BaseActual,
        num2Str: val2.toString(base), // Sin ceros a la izquierda para mostrar arriba
        pasosEsperados: [paso0, paso1, paso2],
        solucionFinal: resultadoFinal,
        solucionStr: (val1 * val2).toString(base) // Para validacion de nivel 0 y 1
    };
};

export function ActividadMultiplicacionClasica() {
    const [dificultad, setDificultad] = useState('0');
    const [ejercicio, setEjercicio] = useState(() => generarMultiplicacion('0'));

    // ESTADOS: Nivel 0 y 1 (Facil y medio) (Pickers)
    const [idxMillares, setIdxMillares] = useState(0);
    const [idxCentenas, setIdxCentenas] = useState(0);
    const [idxDecenas, setIdxDecenas] = useState(0);
    const [idxUnidades, setIdxUnidades] = useState(0);

    // ESTADOS: Nivel 2 (Dificil) (Modo Cuadricula)
    // 3 filas de pasos intermedios, 4 casillas por fila
    const [celdasPasos, setCeldasPasos] = useState([['', '', '', ''], ['', '', '', ''], ['', '', '', '']]);
    // 1 fila final con 6 casillas
    const [celdasFinal, setCeldasFinal] = useState(['', '', '', '', '', '']);
    // Que celda esta seleccionada: { tipo: 'paso'|'final', f: 0, c: 0 }
    const [celdaActiva, setCeldaActiva] = useState(null);
    // Guardamos el feedback de validacion ('correcta', 'erronea')
    const [feedbackPasos, setFeedbackPasos] = useState([[], [], []]);
    const [feedbackFinal, setFeedbackFinal] = useState([]);

    const [estadoRespuesta, setEstadoRespuesta] = useState('idle');

    // Mapa visual (Las celdas van escalonadas a la izquierda como en papel)
    const navegacionGrid = [
        [null, null, 'paso-0-0', 'paso-0-1', 'paso-0-2', 'paso-0-3'], // Paso 0 (Alineado a derecha)
        [null, 'paso-1-0', 'paso-1-1', 'paso-1-2', 'paso-1-3', null],       // Paso 1
        ['paso-2-0', 'paso-2-1', 'paso-2-2', 'paso-2-3', null, null],       // Paso 2
        ['final-0', 'final-1', 'final-2', 'final-3', 'final-4', 'final-5'],  // Total final
        ['btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir']
    ];

    // Funcion traductora -> Convierte el 'string' del mapa en el 'objeto' que espera tu estado
    const activarCeldaClasica = useCallback((idStr) => {
        if (!idStr || idStr === 'btn-corregir') return;

        if (idStr.startsWith('paso')) {
            const parts = idStr.split('-');
            setCeldaActiva({ tipo: 'paso', f: parseInt(parts[1]), c: parseInt(parts[2]) });
        } else if (idStr.startsWith('final')) {
            const parts = idStr.split('-');
            setCeldaActiva({ tipo: 'final', f: 0, c: parseInt(parts[1]) });
        }
    }, []);

    const handleFlechas = useNavegacionFlechas(navegacionGrid, activarCeldaClasica);

    // Auto-focus (Solo lo activamos si estamos en nivel Dificil)
    useAutoFocoInicial(
        ejercicio,
        dificultad === '2' ? 'celda-paso-0-3' : null, // Empezamos a escribir por las unidades del Paso 0
        activarCeldaClasica
    );

    // Estados para los modales
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);
    const [mensajeExito, setMensajeExito] = useState(TEXTOS.feedback.exitoGenerico);
    const [mensajeError, setMensajeError] = useState(TEXTOS.feedback.errorGenerico);

    // --- FUNCIONES COMUNES ---
    const reiniciarTodo = (nuevoNivel = dificultad) => {
        setEjercicio(generarMultiplicacion(nuevoNivel));
        // Reset Pickers
        setIdxMillares(0); setIdxCentenas(0); setIdxDecenas(0); setIdxUnidades(0);
        // Reset Cuadricula
        setCeldasPasos([['', '', '', ''], ['', '', '', ''], ['', '', '', '']]);
        setCeldasFinal(['', '', '', '', '', '']);
        setCeldaActiva(null);
        setFeedbackPasos([[], [], []]);
        setFeedbackFinal([]);
        setEstadoRespuesta('idle');
    };

    const cambiarDificultad = (e) => {
        const nuevo = e.target.value;
        setDificultad(nuevo);
        reiniciarTodo(nuevo);
    };

    // --- Logica del Teclado ---
    const handleTeclaClick = (tecla) => {
        // Si pulsamos 'C', reseteamos TODA la cuadricula y todos los colores
        if (tecla === 'CLEAR') {
            setEstadoRespuesta('idle');
            setFeedbackPasos([[], [], []]);
            setFeedbackFinal([]);
            setCeldasPasos([['', '', '', ''], ['', '', '', ''], ['', '', '', '']]);
            setCeldasFinal(['', '', '', '', '', '']);
            return;
        }

        // Si no hay celda seleccionada, ignoramos las teclas
        if (!celdaActiva) return;

        // Quitamos el borde rojo/verde del contenedor general para indicar que estamos editando
        setEstadoRespuesta('idle');

        const { tipo, f, c } = celdaActiva;
        const valorNuevo = tecla === 'DEL' ? '' : tecla;

        // Actualizamos el valor Y limpiamos SOLO el feedback de esa celda
        if (tipo === 'paso') {
            // Guardar nuevo numero
            const nuevasCeldas = [...celdasPasos];
            nuevasCeldas[f][c] = valorNuevo;
            setCeldasPasos(nuevasCeldas);

            // Limpiar feedback (color) solo de esta celda
            const nuevoFb = [...feedbackPasos];
            if (nuevoFb[f] && nuevoFb[f][c]) {
                const filaFb = [...nuevoFb[f]];
                filaFb[c] = ''; // Quitamos el estado 'correcta' o 'erronea'
                nuevoFb[f] = filaFb;
                setFeedbackPasos(nuevoFb);
            }
        } else {
            // Guardar nuevo numero
            const nuevasCeldas = [...celdasFinal];
            nuevasCeldas[c] = valorNuevo;
            setCeldasFinal(nuevasCeldas);

            // Limpiar feedback (color) solo de esta celda
            const nuevoFb = [...feedbackFinal];
            if (nuevoFb[c]) {
                nuevoFb[c] = '';
                setFeedbackFinal(nuevoFb);
            }
        }
    };

    // Renderizador de Celdas Interactivas
    const renderCelda = (tipo, fila, col) => {
        const valor = tipo === 'paso' ? celdasPasos[fila][col] : celdasFinal[col];
        const isActive = celdaActiva?.tipo === tipo && celdaActiva?.f === fila && celdaActiva?.c === col;
        const feedback = tipo === 'paso' ? (feedbackPasos[fila]?.[col] || '') : (feedbackFinal[col] || '');
        const estaLlena = (valor !== '' && feedback === '') ? 'llena' : '';

        const idCelda = tipo === 'paso' ? `paso-${fila}-${col}` : `final-${col}`;// id para accesibilidad

        return (
            <div
                id={`celda-${idCelda}`}
                key={`${tipo}-${fila}-${col}`}
                className={`celda-digito interactiva ${estaLlena} ${isActive ? 'activa' : ''} ${feedback}`}
                onClick={() => setCeldaActiva({ tipo, f: fila, c: col })}
                onFocus={() => setCeldaActiva({ tipo, f: fila, c: col })}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCeldaActiva({ tipo, f: fila, c: col });
                    } else {
                        handleFlechas(e, idCelda); // Le pasamos el ID en string al hook
                    }
                }}
            >
                {valor !== '' ? new MiNumero(parseInt(valor, 10)).toString() : ''}
            </div>
        );
    };

    const validarEjercicio = () => {
        if (dificultad !== '2') {
            // Validacion Nivel 0 y 1 (Igual que Suma/Resta)
            const m = idxMillares > 0 ? (idxMillares - 1).toString() : '';
            const c = idxCentenas > 0 ? (idxCentenas - 1).toString() : '';
            const d = idxDecenas > 0 ? (idxDecenas - 1).toString() : '';
            const u = idxUnidades > 0 ? (idxUnidades - 1).toString() : '0';

            const respStr = `${m}${c}${d}${u}`.trim().replace(/^0+/, '') || '0';
            if (respStr === ejercicio.solucionStr) {
                setEstadoRespuesta('correct');
                setEsCorrecto(true);
                setMensajeExito(TEXTOS.feedback.exitoGenerico);
            } else {
                setEstadoRespuesta('error');
                setEsCorrecto(false);
                setMensajeError(TEXTOS.feedback.errorGenerico);
            }
        } else {
            // Validacion Nivel Dificil (Celda por Celda)
            let todoCorrecto = true;

            // Evalua una fila devolviendo un array de clases ('correcta'|'erronea')
            const evaluarFila = (valoresUsuario, strEsperadoPad) => {
                return valoresUsuario.map((val, i) => {
                    const esperado = strEsperadoPad[i];
                    // Si se esperaba un espacio ' ', el usuario puede dejarlo vacio '' o poner un '0'
                    let esCorrecta = false;
                    if (esperado === ' ') {
                        esCorrecta = (val === '' || val === '0');
                    } else {
                        esCorrecta = (val === esperado);
                    }
                    if (!esCorrecta) todoCorrecto = false;
                    return esCorrecta ? 'correcta' : 'erronea';
                });
            };

            const fPasos = [
                evaluarFila(celdasPasos[0], ejercicio.pasosEsperados[0]),
                evaluarFila(celdasPasos[1], ejercicio.pasosEsperados[1]),
                evaluarFila(celdasPasos[2], ejercicio.pasosEsperados[2]),
            ];
            const fFinal = evaluarFila(celdasFinal, ejercicio.solucionFinal);

            setFeedbackPasos(fPasos);
            setFeedbackFinal(fFinal);
            setCeldaActiva(null); // Quitamos la seleccion para ver bien los colores

            if (todoCorrecto) {
                setEstadoRespuesta('correct');
                setEsCorrecto(true);
                setMensajeExito(TEXTOS.feedback.exitoMultiplicacionDif);
            } else {
                setEstadoRespuesta('error');
                setEsCorrecto(false);
                setMensajeError(TEXTOS.feedback.errorMultiplicacionDif);
            }
        }
        setMostrarFeedback(true);

        // Desenfocamos cualquier celda que tuviera el foco amarillo
        if (document.activeElement) {
            document.activeElement.blur();
        }
    };

    // Helper visual para Nivel 0 y 1
    const getDigits = (strNum, nivelDificultad) => {
        let length = 2;
        if (nivelDificultad === '1') length = 4;
        return strNum.padStart(length, ' ').split('');
    };

    return (

        <ActividadLayout
            rutas={[
                { label: TEXTOS.titulos.operaciones, path: '/operaciones', icon: 'icon-operaciones' },
                { label: TEXTOS.titulos.multiplicaciones, path: '/operaciones/multiplicaciones', icon: 'icon-multiplicaciones' },
                { label: TEXTOS.titulos.productoClasico, icon: 'icon-multiplicacion-clasica' }
            ]}
            backPath="/operaciones/multiplicaciones"
            dificultad={dificultad}
            onChangeDificultad={cambiarDificultad}
            onReiniciar={() => reiniciarTodo(dificultad)}
            textoInfo={dificultad === '2' ? TEXTOS.infoActividades.productoClasicoDificil : TEXTOS.infoActividades.productoClasicoFacil}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={() => setMostrarFeedback(false)}
            mensajeExito={mensajeExito}
            mensajeError={mensajeError}
            className={`multiplicacion-layout-custom ${dificultad === '2' ? 'modo-dificil' : ''}`}
        >
            <main className="actividad-zona-juego">
                <div className={`operacion-vertical ${estadoRespuesta}`}>

                    {dificultad !== '2' ? (
                        <>
                            {/* LAYOUT FACIL / MEDIO (Con SwipePickers) */}
                            <div className="fila-operacion">
                                <div className="celda-signo invisible">×</div>
                                {getDigits(ejercicio.num1Str, dificultad).map((char, i) => (
                                    <div key={`n1-${i}`} className="celda-digito">{char !== ' ' ? new MiNumero(parseInt(char, 10)).toString() : ''}</div>
                                ))}
                            </div>
                            <div className="fila-operacion">
                                <div className="celda-signo">×</div>
                                {getDigits(ejercicio.num2Str, dificultad).map((char, i) => (
                                    <div key={`n2-${i}`} className="celda-digito">{char !== ' ' ? new MiNumero(parseInt(char, 10)).toString() : ''}</div>
                                ))}
                            </div>
                            <div className="linea-separadora"></div>
                            <div className="fila-operacion fila-pickers">
                                <div className="celda-signo invisible"></div>
                                {dificultad === '1' && <SwipePicker opciones={OPCIONES_DIGITOS} value={idxMillares} onChange={(v) => { setIdxMillares(v); setEstadoRespuesta('idle') }} />}
                                {dificultad === '1' && <SwipePicker opciones={OPCIONES_DIGITOS} value={idxCentenas} onChange={(v) => { setIdxCentenas(v); setEstadoRespuesta('idle') }} />}
                                <SwipePicker opciones={OPCIONES_DIGITOS} value={idxDecenas} onChange={(v) => { setIdxDecenas(v); setEstadoRespuesta('idle') }} />
                                <SwipePicker opciones={OPCIONES_DIGITOS} value={idxUnidades} onChange={(v) => { setIdxUnidades(v); setEstadoRespuesta('idle') }} />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* LAYOUT DIFICIL (Cuadricula Interactiva) */}
                            <div className="fila-operacion">
                                <div className="celda-signo invisible"></div>
                                {/* Desplazamos 3 casillas para alinear con la solucion final de 6 cifras */}

                                <div className="celda-invisible"></div><div className="celda-invisible"></div><div className="celda-invisible"></div>
                                {ejercicio.num1Str.padStart(3, ' ').split('').map((c, i) => (
                                    <div key={`h1-${i}`} className="celda-digito">{c !== ' ' ? new MiNumero(parseInt(c, 10)).toString() : ''}</div>
                                ))}
                            </div>

                            <div className="fila-operacion">
                                <div className="celda-signo">×</div>
                                <div className="celda-invisible"></div><div className="celda-invisible"></div>
                                {ejercicio.num2Str.padStart(3, ' ').split('').map((c, i) => (
                                    <div key={`h2-${i}`} className="celda-digito">{c !== ' ' ? new MiNumero(parseInt(c, 10)).toString() : ''}</div>
                                ))}
                            </div>
                            <div className="linea-separadora"></div>

                            {/* FILAS DE PASOS INTERMEDIOS */}
                            {/* Paso 0 (alineado a la derecha, 0 huecos al final) */}
                            <div className="fila-operacion">
                                <div className="celda-signo invisible"></div>
                                <div className="celda-invisible"></div><div className="celda-invisible"></div>
                                {celdasPasos[0].map((_, col) => renderCelda('paso', 0, col))}
                            </div>
                            {/* Paso 1 (Desplazado 1 hueco a la izquierda) */}
                            <div className="fila-operacion">
                                <div className="celda-signo invisible"></div>
                                <div className="celda-invisible"></div>
                                {celdasPasos[1].map((_, col) => renderCelda('paso', 1, col))}
                                <div className="celda-invisible"></div>
                            </div>
                            {/* Paso 2 (Desplazado 2 huecos a la izquierda) */}

                            <div className="fila-operacion">
                                <div className="celda-signo invisible"></div>
                                {celdasPasos[2].map((_, col) => renderCelda('paso', 2, col))}
                                <div className="celda-invisible"></div><div className="celda-invisible"></div>
                            </div>

                            <div className="linea-separadora"></div>
                            {/* RESULTADO FINAL (6 cifras) */}

                            <div className="fila-operacion">
                                <div className="celda-signo invisible"></div>
                                {celdasFinal.map((_, col) => renderCelda('final', 0, col))}
                            </div>
                        </>
                    )}

                </div>
                {dificultad === '2' && (
                    <div className="panel-derecho-dificil">
                        <TecladoBase onTeclaClick={handleTeclaClick} />
                        <button
                            id="celda-btn-corregir"
                            className="btn-corregir-full hover-primary"
                            onClick={validarEjercicio}
                            onKeyDown={(e) => {
                                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                    handleFlechas(e, 'btn-corregir');
                                }
                            }}>
                            {TEXTOS.global.corregir}
                        </button>
                    </div>
                )}
            </main>
            {dificultad !== '2' && (
                <footer className="actividad-footer">
                    <button
                        id="celda-btn-corregir"
                        className="btn-corregir-full hover-primary"
                        onClick={validarEjercicio}
                        onKeyDown={(e) => {
                            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                handleFlechas(e, 'btn-corregir');
                            }
                        }}>
                        {TEXTOS.global.corregir}
                    </button>
                </footer>
            )}
        </ActividadLayout>
    );
}