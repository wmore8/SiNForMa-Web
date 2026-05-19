import { useState } from 'react';
import { SwipePicker } from '../shared/components/SwipePicker';
import { MiNumero } from '../shared/utils/MiNumero';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { TEXTOS } from '../constants/textos';
import { CeldaInteractiva } from '../shared/components/CeldaInteractiva';
import { PanelTeclado } from '../shared/components/PanelTeclado';
import { useInputMode } from '../shared/hooks/useInputMode';
import { useNavegacionFlechas } from '../shared/hooks/useNavegacionFlechas';
import { useAutoFocoInicial } from '../shared/hooks/useAutoFocoInicial';
import { useTecladoCeldas } from '../shared/hooks/useTecladoCeldas';
import '../styles/ActividadOperaciones.css';

const OPCIONES_DIGITOS = [' ', ...MiNumero.losDigitos];
const OPCIONES_SIGNO = [' ', '−']

const generarResta = (nivel) => {
    const base = MiNumero.baseActual;
    const rand = (max) => Math.floor(Math.random() * max);
    let c1 = 0, d1 = 0, u1 = 0;
    let c2 = 0, d2 = 0, u2 = 0;

    if (nivel === '0') {
        // Facil: 1 digito. n1 >= n2
        u1 = rand(base);
        u2 = rand(u1 + 1);
    } else if (nivel === '1') {
        // Medio: 3 digitos, SIN llevadas. Cada digito n2 <= digito n1
        c1 = rand(base); c2 = rand(c1 + 1);
        d1 = rand(base); d2 = rand(d1 + 1);
        u1 = rand(base); u2 = rand(u1 + 1);
    } else {
        // Dificil: 3 digitos aleatorios. (Puede dar llevadas y negativos)
        c1 = rand(base); c2 = rand(base);
        d1 = rand(base); d2 = rand(base);
        u1 = rand(base); u2 = rand(base);
    }

    // Construimos los strings (quitando ceros a la izquierda)
    const strN1 = `${c1}${d1}${u1}`.replace(/^0+/, '') || '0';
    const strN2 = `${c2}${d2}${u2}`.replace(/^0+/, '') || '0';

    // Pasamos a decimal para operar matematicamente
    const val1 = parseInt(strN1, base);
    const val2 = parseInt(strN2, base);
    // Calculamos si es negativo y sacamos el valor absoluto en la Base actual
    const esNegativo = val1 < val2;
    const resStrBaseActual = Math.abs(val1 - val2).toString(base);

    return {
        num1Str: strN1,
        num2Str: strN2,
        solucionAbsoluta: resStrBaseActual,
        esNegativo: esNegativo
    };
};

export function ActividadResta() {
    // Iniciamos el hook para manejar Teclado o los swipe Pickers
    const { inputMode, toggleInputMode, activeCellId, setActiveCellId } = useInputMode('picker');
    // Estado para guardar el color (correcta/erronea) de cada celda independiente
    const { valoresCeldas, setValoresCeldas, feedbackCeldas, setFeedbackCeldas, handleKeyPress, limpiarCeldas } = useTecladoCeldas(activeCellId, setActiveCellId);

    const [dificultad, setDificultad] = useState('0');
    const [ejercicio, setEjercicio] = useState(() => generarResta('0'));
    // Estado visual para el CSS (borde de la caja)
    const [estadoRespuesta, setEstadoRespuesta] = useState('idle');

    // Estados para los modales
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);

    //Mapa visual para las flechas 
    const navegacionGrid = [
        [
            dificultad === '2' ? 'signo' : null,
            dificultad >= '1' ? 'centenas' : null,
            'decenas',
            'unidades'
        ],
        ['btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir']
    ];
    //para manejar el uso de flechas
    const handleFlechas = useNavegacionFlechas(navegacionGrid, setActiveCellId);
    //para hacer focus a las unidades
    useAutoFocoInicial(`${ejercicio.solucionAbsoluta}-${inputMode}`, inputMode === 'keyboard' ? 'unidades' : null, setActiveCellId);

    const cambiarDificultad = (e) => {
        const nuevoNivel = e.target.value;
        setDificultad(nuevoNivel);
        setEjercicio(generarResta(nuevoNivel));
        resetearInputs();
    };

    const reiniciarJuego = () => {
        setEjercicio(generarResta(dificultad));
        resetearInputs();
    };

    const resetearInputs = () => {
        limpiarCeldas();
        setEstadoRespuesta('idle');
        setMostrarFeedback(false);
        setActiveCellId(inputMode === 'keyboard' ? 'unidades' : null);
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
        if (activeCellId === 'signo') {
            if (tecla === 'DEL' || tecla === 'borrar') {
                setValoresCeldas(prev => ({ ...prev, 'signo': 0 }));
            } else if (tecla === 'CLEAR') {
                limpiarCeldas();
            } else {
                setValoresCeldas(prev => ({ ...prev, 'signo': 1 })); // Cualquier otra tecla pone el signo menos
            }
            setEstadoRespuesta('idle');
            return;
        }
        handleKeyPress(tecla);
        setEstadoRespuesta('idle');
    };

    //wrapper para reiniciar estado de respuesta para el teclado
    const handleSignoToggle = () => {
        setValoresCeldas(prev => ({ ...prev, 'signo': prev['signo'] === 1 ? 0 : 1 }));
        setEstadoRespuesta('idle');
        setActiveCellId('signo');
    };

    const validarEjercicio = () => {
        let length = 2;
        if (dificultad >= '1') length = 3; //para el modo medio y dificil
        const solPad = ejercicio.solucionAbsoluta.padStart(length, ' ');

        const cellIds = []; //creamos los ids de las celdas en funcion de la dificultad
        if (dificultad >= '1') cellIds.push('centenas');
        cellIds.push('decenas', 'unidades');

        //Nos quedamos con los valores introducidos por el usuario
        const userVals = cellIds.map(id => {
            const valorObtenido = valoresCeldas[id] || 0;
            return valorObtenido > 0 ? (valorObtenido - 1).toString() : ' ';
        });

        const usuarioPoneNegativo = (valoresCeldas['signo'] || 0) === 1;
        const esCero = ejercicio.solucionAbsoluta === '0' && userVals.join('').trim() === '0';

        let todoCorrecto = true;
        const nuevoFeedback = {};

        // Validamos digitos
        cellIds.forEach((id, index) => {
            const esperado = solPad[index];
            const usuario = userVals[index];
            let esCorrecta = (esperado === ' ' || esperado === '0') ? (usuario === ' ' || usuario === '0') : (usuario === esperado);

            if (!esCorrecta) todoCorrecto = false;
            nuevoFeedback[id] = esCorrecta ? 'correcta' : 'erronea';
        });

        // Validamos el signo (solo en dificil)
        if (dificultad === '2') {
            if ((usuarioPoneNegativo === ejercicio.esNegativo) || esCero) {
                nuevoFeedback['signo'] = 'correcta';
            } else {
                nuevoFeedback['signo'] = 'erronea';
                todoCorrecto = false;
            }
        }

        setFeedbackCeldas(nuevoFeedback);
        setEstadoRespuesta(todoCorrecto ? 'correct' : 'error');
        setEsCorrecto(todoCorrecto);
        setMostrarFeedback(true);
        setActiveCellId(null);
    };

    // Rellena con espacios en blanco para mantener la cuadricula
    const getDigits = (strNum, nivelDificultad) => {
        let length = 2; // Facil: Decenas y Unidades
        if (nivelDificultad >= '1') length = 3; // Medio y Dificil: Max 3 cifras
        return strNum.padStart(length, ' ').split('');
    };

    const renderPicker = (id) => (
        <SwipePicker opciones={id === 'signo' ? OPCIONES_SIGNO : OPCIONES_DIGITOS}
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
                { label: TEXTOS.titulos.resta, icon: 'icon-resta' }
            ]}
            backPath="/operaciones"
            dificultad={dificultad}
            onChangeDificultad={cambiarDificultad}
            onReiniciar={reiniciarJuego}
            textoInfo={TEXTOS.infoActividades.resta}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={() => setMostrarFeedback(false)}
            mostrarToggleInput={true}
            inputMode={inputMode}
            onToggleInputMode={toggleInputMode}
            className={inputMode === 'keyboard' ? 'multiplicacion-layout-custom modo-dificil' : ''}
        >
            <main className="actividad-zona-juego">
                <div className="panel-izquierdo">
                    <div className={`operacion-vertical ${estadoRespuesta}`}>
                        {/* Primer Numero (Minuendo) */}
                        <div className="fila-operacion">
                            <div className="celda-signo invisible">-</div>
                            {dificultad === '2' && <div className="celda-digito"></div>}
                            {/* Espacio extra para alinear con el Signo del Picker en el nivel dificil*/}
                            {getDigits(ejercicio.num1Str, dificultad).map((char, index) => (
                                <div key={`n1-${index}`} className="celda-digito">
                                    {char !== ' ' ? new MiNumero(parseInt(char, 10)).toString() : ''}
                                </div>
                            ))}
                        </div>

                        {/* Segundo Numero (Sustraendo) */}
                        <div className="fila-operacion">
                            <div className="celda-signo">−</div>
                            {dificultad === '2' && <div className="celda-digito"></div>}
                            {getDigits(ejercicio.num2Str, dificultad).map((char, index) => (
                                <div key={`n2-${index}`} className="celda-digito">
                                    {char !== ' ' ? new MiNumero(parseInt(char, 10)).toString() : ''}
                                </div>
                            ))}
                        </div>

                        <div className="linea-separadora"></div>

                        {inputMode === 'picker' ? (
                            <div className="fila-operacion fila-pickers">
                                <div className="celda-signo invisible"></div>
                                {dificultad === '2' && renderPicker('signo')}
                                {dificultad >= '1' && renderPicker('centenas')}
                                {renderPicker('decenas')}
                                {renderPicker('unidades')}
                            </div>
                        ) : (
                            <div className="fila-operacion">
                                <div className="celda-signo invisible"></div>
                                {dificultad === '2' && (
                                    <div
                                        id="celda-signo"
                                        className={`celda-digito interactiva ${(valoresCeldas['signo'] > 0 && !feedbackCeldas['signo']) ? 'llena' : ''} ${activeCellId === 'signo' ? 'activa' : ''} ${feedbackCeldas['signo'] || ''}`}
                                        onClick={handleSignoToggle}
                                        onFocus={() => setActiveCellId('signo')}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSignoToggle(); }
                                            else { handleFlechas(e, 'signo'); }
                                        }}
                                    >
                                        {valoresCeldas['signo'] === 1 ? '−' : ''}
                                    </div>
                                )}
                                {dificultad >= '1' && renderCelda('centenas')}
                                {renderCelda('decenas')}
                                {renderCelda('unidades')}
                            </div>
                        )}
                    </div>
                </div>
                {inputMode === 'keyboard' && (
                    <PanelTeclado onTeclaClick={handleTeclaClick} onCorregir={validarEjercicio} handleFlechas={handleFlechas} />
                )}
            </main>

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