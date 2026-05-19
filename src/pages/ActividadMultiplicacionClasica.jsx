import { useState } from 'react';
import { SwipePicker } from '../shared/components/SwipePicker';
import { MiNumero } from '../shared/utils/MiNumero';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { CeldaInteractiva } from '../shared/components/CeldaInteractiva';
import { PanelTeclado } from '../shared/components/PanelTeclado';
import { TEXTOS } from '../constants/textos';
import { useInputMode } from '../shared/hooks/useInputMode';
import { useNavegacionFlechas } from '../shared/hooks/useNavegacionFlechas';
import { useAutoFocoInicial } from '../shared/hooks/useAutoFocoInicial';
import { useTecladoCeldas } from '../shared/hooks/useTecladoCeldas';
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
    // Iniciamos el hook para manejar Teclado o los swipe Pickers
    const { inputMode, toggleInputMode, activeCellId, setActiveCellId } = useInputMode('picker');
    // Estado para guardar el color (correcta/erronea) de cada celda independiente
    const { valoresCeldas, setValoresCeldas, feedbackCeldas, setFeedbackCeldas, handleKeyPress, limpiarCeldas } = useTecladoCeldas(activeCellId, setActiveCellId);

    const [dificultad, setDificultad] = useState('0');
    const [ejercicio, setEjercicio] = useState(() => generarMultiplicacion('0'));

    const [estadoRespuesta, setEstadoRespuesta] = useState('idle');

    // Estados para los modales
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);
    const [mensajeExito, setMensajeExito] = useState(TEXTOS.feedback.exitoGenerico);
    const [mensajeError, setMensajeError] = useState(TEXTOS.feedback.errorGenerico);

    const isKeyboardMode = inputMode === 'keyboard' || dificultad === '2';

    // Mapa visual (para unidades y decenas)
    const navegacionGrid = dificultad !== '2'
        ? [
            [
                dificultad === '1' ? 'millares' : null,
                dificultad === '1' ? 'centenas' : null,
                'decenas',
                'unidades'
            ],
            ['btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir']
        ]
        : [
            [null, null, 'paso-0-0', 'paso-0-1', 'paso-0-2', 'paso-0-3'], // Paso 0 (Alineado a derecha)
            [null, 'paso-1-0', 'paso-1-1', 'paso-1-2', 'paso-1-3', null],       // Paso 1
            ['paso-2-0', 'paso-2-1', 'paso-2-2', 'paso-2-3', null, null],       // Paso 2
            ['final-0', 'final-1', 'final-2', 'final-3', 'final-4', 'final-5'],  // Total final
            ['btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir']
        ];

    const handleFlechas = useNavegacionFlechas(navegacionGrid, setActiveCellId);
    useAutoFocoInicial(
        `${ejercicio.solucionStr}-${isKeyboardMode}`,
        isKeyboardMode ? (dificultad === '2' ? 'paso-0-3' : 'unidades') : null,
        setActiveCellId
    );

    // --- FUNCIONES COMUNES ---
    const reiniciarTodo = (nuevoNivel = dificultad) => {
        setEjercicio(generarMultiplicacion(nuevoNivel));
        limpiarCeldas();
        setEstadoRespuesta('idle');
        setMostrarFeedback(false);
        setActiveCellId(isKeyboardMode ? (nuevoNivel === '2' ? 'paso-0-3' : 'unidades') : null);
    };

    const cambiarDificultad = (e) => {
        const nuevo = e.target.value;
        setDificultad(nuevo);
        reiniciarTodo(nuevo);
    };

    //wrapper para reiniciar estado de respuesta para las celdas
    const handleSeleccionarCelda = (id) => {
        setActiveCellId(id);
        setEstadoRespuesta('idle');
    };

    //wrapper para reiniciar estado de respuesta para el teclado
    const handleTeclaClick = (tecla) => {
        handleKeyPress(tecla);
        setEstadoRespuesta('idle');
    };

    //wrapper para reiniciar estado de respuesta para los pickers
    const handlePickerChange = (id) => (valIdx) => {
        setValoresCeldas(prev => ({ ...prev, [id]: valIdx }));
        setEstadoRespuesta('idle');
    };

    const validarEjercicio = () => {
        let todoCorrecto = true;
        const nuevoFeedback = {};

        if (dificultad !== '2') {
            // Validacion Nivel Facil / Medio
            let length = 2;
            if (dificultad === '1') length = 4;
            const solPad = ejercicio.solucionStr.padStart(length, ' ');
            const cellIds = dificultad === '1' ? ['millares', 'centenas', 'decenas', 'unidades'] : ['decenas', 'unidades'];

            const userVals = cellIds.map(id => {
                const valorRaw = valoresCeldas[id] || 0;
                return valorRaw > 0 ? (valorRaw - 1).toString() : ' ';
            });

            cellIds.forEach((id, index) => {
                const esperado = solPad[index];
                const usuario = userVals[index];
                let esCorrecta = (esperado === ' ' || esperado === '0') ? (usuario === ' ' || usuario === '0') : (usuario === esperado);
                if (!esCorrecta) todoCorrecto = false;
                nuevoFeedback[id] = esCorrecta ? 'correcta' : 'erronea';
            });

            setMensajeExito(TEXTOS.feedback.exitoGenerico);
            setMensajeError(TEXTOS.feedback.errorGenerico);
        } else {
            // Validacion Nivel Dificil (Cuadricula entera)
            const evaluarFila = (prefijoIds, maxCols, strEsperadoPad) => {
                for (let i = 0; i < maxCols; i++) {
                    const id = `${prefijoIds}-${i}`;
                    const esperado = strEsperadoPad[i];
                    const valorRaw = valoresCeldas[id] || 0;
                    const val = valorRaw > 0 ? (valorRaw - 1).toString() : ' ';

                    let esCorrecta = (esperado === ' ' || esperado === '0') ? (val === ' ' || val === '0') : (val === esperado);
                    if (!esCorrecta) todoCorrecto = false;
                    nuevoFeedback[id] = esCorrecta ? 'correcta' : 'erronea';
                }
            };

            evaluarFila('paso-0', 4, ejercicio.pasosEsperados[0]);
            evaluarFila('paso-1', 4, ejercicio.pasosEsperados[1]);
            evaluarFila('paso-2', 4, ejercicio.pasosEsperados[2]);
            evaluarFila('final', 6, ejercicio.solucionFinal);

            setMensajeExito(TEXTOS.feedback.exitoMultiplicacionDif);
            setMensajeError(TEXTOS.feedback.errorMultiplicacionDif);
        }

        setFeedbackCeldas(nuevoFeedback);
        setEstadoRespuesta(todoCorrecto ? 'correct' : 'error');
        setEsCorrecto(todoCorrecto);
        setMostrarFeedback(true);
        setActiveCellId(null);
    };

    // Helper visual para Nivel 0 y 1
    const getDigits = (strNum, nivelDificultad) => {
        let length = 2;
        if (nivelDificultad === '1') length = 4;
        return strNum.padStart(length, ' ').split('');
    };

    const renderPicker = (id) => (
        <SwipePicker opciones={OPCIONES_DIGITOS}
            value={valoresCeldas[id] || 0}
            onChange={handlePickerChange(id)} />
    );

    const renderCelda = (id) => (
        <CeldaInteractiva
            key={id}
            id={id}
            valor={valoresCeldas[id] || 0}
            isActive={activeCellId === id}
            feedback={feedbackCeldas[id]}
            onSelect={handleSeleccionarCelda}
            handleFlechas={handleFlechas}
        />
    );

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
            mostrarToggleInput={dificultad !== '2'} // en el nivel dificil solo se usa teclado
            inputMode={isKeyboardMode ? 'keyboard' : 'picker'}
            onToggleInputMode={toggleInputMode}
            className={isKeyboardMode ? 'multiplicacion-layout-custom modo-dificil' : ''}
        >
            <main className="actividad-zona-juego">
                <div className="panel-izquierdo">
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
                                {!isKeyboardMode ? (
                                    <div className="fila-operacion fila-pickers">
                                        <div className="celda-signo invisible"></div>
                                        {dificultad === '1' && renderPicker('millares')}
                                        {dificultad === '1' && renderPicker('centenas')}
                                        {renderPicker('decenas')}
                                        {renderPicker('unidades')}
                                    </div>
                                ) : (
                                    <div className="fila-operacion">
                                        <div className="celda-signo invisible"></div>
                                        {dificultad === '1' && renderCelda('millares')}
                                        {dificultad === '1' && renderCelda('centenas')}
                                        {renderCelda('decenas')}
                                        {renderCelda('unidades')}
                                    </div>
                                )}
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

                                {/* Filas de pasos intermedios (Generadas dinamicamente) */}
                                {[0, 1, 2].map(fila => (
                                    <div className="fila-operacion" key={`fila-paso-${fila}`}>
                                        <div className="celda-signo invisible"></div>
                                        {/* Ajustamos los espacios vacios segun el escalonamiento de la fila */}
                                        {Array.from({ length: 2 - fila }).map((_, i) => <div key={`inv-l-${fila}-${i}`} className="celda-invisible"></div>)}
                                        {[0, 1, 2, 3].map(col => renderCelda(`paso-${fila}-${col}`))}
                                        {Array.from({ length: fila }).map((_, i) => <div key={`inv-r-${fila}-${i}`} className="celda-invisible"></div>)}
                                    </div>
                                ))}

                                <div className="linea-separadora"></div>
                                {/* RESULTADO FINAL (6 cifras) */}

                                <div className="fila-operacion">
                                    <div className="celda-signo invisible"></div>
                                    {[0, 1, 2, 3, 4, 5].map(col => renderCelda(`final-${col}`))}
                                </div>
                            </>
                        )}

                    </div>
                </div>
                {isKeyboardMode && (
                    <PanelTeclado onTeclaClick={handleTeclaClick} onCorregir={validarEjercicio} handleFlechas={handleFlechas} />
                )}
            </main>

            {!isKeyboardMode && (
                <footer className="actividad-footer">
                    <button className="btn-corregir-full hover-primary" onClick={validarEjercicio}>
                        {TEXTOS.global.corregir}
                    </button>
                </footer>
            )}
        </ActividadLayout>
    );
}