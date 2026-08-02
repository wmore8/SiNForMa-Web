import { useState } from 'react';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { TEXTOS } from '../constants/textos';
import { MiNumero } from '../shared/utils/MiNumero';
import { SwipePicker } from '../shared/components/SwipePicker';
import { CeldaInteractiva } from '../shared/components/CeldaInteractiva';
import { PanelTeclado } from '../shared/components/PanelTeclado';
import { useInputMode } from '../shared/hooks/useInputMode';
import { useNavegacionFlechas } from '../shared/hooks/useNavegacionFlechas';
import { useAutoFocoInicial } from '../shared/hooks/useAutoFocoInicial';
import { useTecladoCeldas } from '../shared/hooks/useTecladoCeldas';
import '../styles/ActividadOperaciones.css';

const OPCIONES_DIGITOS = [' ', ...MiNumero.losDigitos];

const generarSuma = (nivel) => {
    const base = MiNumero.baseActual;
    const rand = (max) => Math.floor(Math.random() * max);
    let c1 = 0, d1 = 0, u1 = 0;
    let c2 = 0, d2 = 0, u2 = 0;

    if (nivel === '0') {
        // Facil: 1 digito. La suma de ambos NO supera la base (sin llevadas)
        u1 = rand(base);
        u2 = rand(base - u1);
    } else if (nivel === '1') {
        // Medio: 3 digitos, SIN llevadas.
        c1 = rand(base); c2 = rand(base - c1);
        d1 = rand(base); d2 = rand(base - d1);
        u1 = rand(base); u2 = rand(base - u1);
    } else {
        // Dificil: 3 digitos aleatorios. (Seguro que hay llevadas)
        c1 = rand(base); c2 = rand(base);
        d1 = rand(base); d2 = rand(base);
        u1 = rand(base); u2 = rand(base);
    }

    // Construimos los strings numericos. Quitamos ceros a la izquierda.
    const strN1 = `${c1}${d1}${u1}`.replace(/^0+/, '') || '0';
    const strN2 = `${c2}${d2}${u2}`.replace(/^0+/, '') || '0';

    // Convertimos a decimal para sumar, y volvemos a pasar a Base 8
    const val1 = parseInt(strN1, base);
    const val2 = parseInt(strN2, base);
    const sumStrBaseActual = (val1 + val2).toString(base);

    return {
        num1Str: strN1,
        num2Str: strN2,
        solucionStr: sumStrBaseActual
    };
};

export function ActividadSuma() {
    // Iniciamos el hook para manejar Teclado o los swipe Pickers
    const { inputMode, toggleInputMode, activeCellId, setActiveCellId } = useInputMode('picker');
    // Estado para guardar el color (correcta/erronea) de cada celda independiente
    const { valoresCeldas, setValoresCeldas, feedbackCeldas, setFeedbackCeldas, handleKeyPress, limpiarCeldas } = useTecladoCeldas(activeCellId, setActiveCellId);

    const [dificultad, setDificultad] = useState('0');
    const [ejercicio, setEjercicio] = useState(() => generarSuma('0'));

    const [estadoRespuesta, setEstadoRespuesta] = useState('idle');

    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);

    //Mapa visual para las flechas 
    const navegacionGrid = [
        [
            dificultad === '2' ? 'millares' : null,
            dificultad >= '1' ? 'centenas' : null,
            'decenas',
            'unidades'
        ],
        ['btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir']
    ];

    //para manejar el uso de flechas
    const handleFlechas = useNavegacionFlechas(navegacionGrid, setActiveCellId);
    //para hacer focus a las unidades
    useAutoFocoInicial(`${ejercicio.solucionStr}-${inputMode}`, inputMode === 'keyboard' ? 'unidades' : null, setActiveCellId);

    const cambiarDificultad = (e) => {
        const nuevoNivel = e.target.value;
        setDificultad(nuevoNivel);
        setEjercicio(generarSuma(nuevoNivel));
        resetearInputs();
    };

    const reiniciarJuego = () => {
        setEjercicio(generarSuma(dificultad));
        resetearInputs();
    };

    const resetearInputs = () => {
        limpiarCeldas();
        setEstadoRespuesta('idle');
        setMostrarFeedback(false);
        setActiveCellId(inputMode === 'keyboard' ? 'unidades' : null);
    };

    const validarEjercicio = () => {
        let length = 2;
        if (dificultad === '1') length = 3;
        if (dificultad === '2') length = 4;

        // Rellenamos la solucion con espacios en blanco a la izquierda para poder comparar
        const solPad = ejercicio.solucionStr.padStart(length, ' ');

        const cellIds = [];
        if (dificultad === '2') cellIds.push('millares');
        if (dificultad >= '1') cellIds.push('centenas');
        cellIds.push('decenas', 'unidades');

        const userVals = cellIds.map(id => {
            const valorRaw = valoresCeldas[id] || 0;
            return valorRaw > 0 ? (valorRaw - 1).toString() : ' ';
        });

        let todoCorrecto = true;
        const nuevoFeedback = {};

        // Comparamos digito a digito
        cellIds.forEach((id, index) => {
            const esperado = solPad[index];
            const usuario = userVals[index];
            let esCorrecta = false;

            if (esperado === ' ') {
                // Ceros a la izquierda no significativos: perdonamos si dejan el espacio o si ponen un '0'
                esCorrecta = (usuario === ' ' || usuario === '0');
            } else {
                // Digitos posicionales significativos (incluido el 0): exige coincidencia exacta
                esCorrecta = (usuario === esperado);
            }

            if (!esCorrecta) todoCorrecto = false;
            nuevoFeedback[id] = esCorrecta ? 'correcta' : 'erronea';
        });

        setFeedbackCeldas(nuevoFeedback);
        setEstadoRespuesta(todoCorrecto ? 'correct' : 'error');
        setEsCorrecto(todoCorrecto);
        setMostrarFeedback(true);
        setActiveCellId(null);
    };

    //wrapper para reiniciar estado de respuesta para los pickers
    const handlePickerChange = (id) => (valIdx) => {
        setValoresCeldas(prev => ({ ...prev, [id]: valIdx }));
        setEstadoRespuesta('idle');
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


    // Rellena con espacios en blanco para mantener la cuadricula perfecta
    const getDigits = (strNum, nivelDificultad) => {
        let length = 2; // Facil
        if (nivelDificultad === '1') length = 3; // Medio
        if (nivelDificultad === '2') length = 4; // Dificil
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
                { label: TEXTOS.titulos.suma, icon: 'icon-suma' }]}
            backPath="/operaciones"
            dificultad={dificultad}
            onChangeDificultad={cambiarDificultad}
            onReiniciar={reiniciarJuego}
            textoInfo={TEXTOS.infoActividades.suma}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={() => setMostrarFeedback(false)}
            mostrarToggleInput={true}
            inputMode={inputMode}
            onToggleInputMode={toggleInputMode}
            className={inputMode === 'keyboard' ? 'multiplicacion-layout-custom modo-dificil' : ''}
        >

            <main className="actividad-zona-juego">
                {/* PANEL IZQUIERDO*/}
                <div className="panel-izquierdo">
                    <div className={`operacion-vertical ${estadoRespuesta}`}>
                        {/* Primer Numero */}
                        <div className="fila-operacion">
                            <div className="celda-signo invisible">+</div>
                            {getDigits(ejercicio.num1Str, dificultad).map((char, index) => (
                                <div key={`n1-${index}`} className="celda-digito">
                                    {char !== ' ' ? new MiNumero(parseInt(char, 10)).toString() : ''}
                                </div>
                            ))}
                        </div>

                        {/* Segundo Numero */}
                        <div className="fila-operacion">
                            <div className="celda-signo">+</div>
                            {getDigits(ejercicio.num2Str, dificultad).map((char, index) => (
                                <div key={`n2-${index}`} className="celda-digito">
                                    {char !== ' ' ? new MiNumero(parseInt(char, 10)).toString() : ''}
                                </div>
                            ))}
                        </div>

                        <div className="linea-separadora"></div>

                        {/* INPUT TECLADO O PICKERS */}
                        {inputMode === 'picker' ? (
                            <div className="fila-operacion fila-pickers">
                                <div className="celda-signo invisible"></div>
                                {dificultad === '2' && renderPicker('millares')}
                                {dificultad >= '1' && renderPicker('centenas')}
                                {renderPicker('decenas')}
                                {renderPicker('unidades')}
                            </div>
                        ) : (
                            <div className="fila-operacion">
                                <div className="celda-signo invisible"></div>
                                {dificultad === '2' && renderCelda('millares')}
                                {dificultad >= '1' && renderCelda('centenas')}
                                {renderCelda('decenas')}
                                {renderCelda('unidades')}
                            </div>
                        )}
                    </div>
                </div>

                {/* PANEL DERECHO */}
                {inputMode === 'keyboard' && (
                    <PanelTeclado onTeclaClick={handleTeclaClick} onCorregir={validarEjercicio} handleFlechas={handleFlechas} />
                )}
            </main>
            {/* BOTON INFERIOR PARA PICKERS (Fuera del main, como hacias antes) */}
            {inputMode === 'picker' && (
                <footer className="actividad-footer">
                    <button className="btn-corregir-full hover-primary" onClick={validarEjercicio}>
                        {TEXTOS.global.corregir}
                    </button>
                </footer>
            )}
        </ActividadLayout>
    );
}