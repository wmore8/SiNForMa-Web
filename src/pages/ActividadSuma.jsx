import { useState } from 'react';
import { TEXTOS } from '../constants/textos';
import { MiNumero } from '../shared/utils/MiNumero';
import { SwipePicker } from '../shared/components/SwipePicker';
import { ActividadLayout } from '../shared/components/ActividadLayout';
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
    const [dificultad, setDificultad] = useState('0');
    const [ejercicio, setEjercicio] = useState(() => generarSuma('0'));

    const [idxMillares, setIdxMillares] = useState(0);
    const [idxCentenas, setIdxCentenas] = useState(0);
    const [idxDecenas, setIdxDecenas] = useState(0);
    const [idxUnidades, setIdxUnidades] = useState(0);

    const [estadoRespuesta, setEstadoRespuesta] = useState('idle');

    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);

    const cambiarDificultad = (e) => {
        const nuevoNivel = e.target.value;
        setDificultad(nuevoNivel);
        setEjercicio(generarSuma(nuevoNivel));
        resetearPickers();
    };

    const reiniciarJuego = () => {
        setEjercicio(generarSuma(dificultad));
        resetearPickers();
    };

    const resetearPickers = () => {
        setIdxMillares(0);
        setIdxCentenas(0);
        setIdxDecenas(0);
        setIdxUnidades(0);
        setEstadoRespuesta('idle');
    };

    const validarEjercicio = () => {
        // Leemos los valores del Picker (si es 0, es un espacio vacio)
        const m = idxMillares > 0 ? (idxMillares - 1).toString() : '';
        const c = idxCentenas > 0 ? (idxCentenas - 1).toString() : '';
        const d = idxDecenas > 0 ? (idxDecenas - 1).toString() : '';
        const u = idxUnidades > 0 ? (idxUnidades - 1).toString() : '0';

        // Juntamos la respuesta y le quitamos ceros/espacios a la izquierda
        let respuestaStr = `${m}${c}${d}${u}`.trim().replace(/^0+/, '') || '0';

        const acierto = respuestaStr === ejercicio.solucionStr;
        setEstadoRespuesta(acierto ? 'correct' : 'error');
        setEsCorrecto(acierto);
        setMostrarFeedback(true);
    };

    const handlePickerChange = (setter) => (val) => {
        setter(val);
        setEstadoRespuesta('idle');
    };

    // Rellena con espacios en blanco para mantener la cuadricula perfecta
    const getDigits = (strNum, nivelDificultad) => {
        let length = 2; // Facil
        if (nivelDificultad === '1') length = 3; // Medio
        if (nivelDificultad === '2') length = 4; // Dificil
        return strNum.padStart(length, ' ').split('');
    };

    return (
        <ActividadLayout
            rutas={[{ label: TEXTOS.titulos.operaciones, path: '/operaciones' }, { label: TEXTOS.titulos.suma }]}
            backPath="/operaciones"
            dificultad={dificultad}
            onChangeDificultad={cambiarDificultad}
            onReiniciar={reiniciarJuego}
            textoInfo={TEXTOS.infoActividades.suma}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={() => setMostrarFeedback(false)}
        >

            <main className="actividad-zona-juego">
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

                    {/* Pickers */}
                    <div className="fila-operacion fila-pickers">
                        <div className="celda-signo invisible"></div>
                        {dificultad === '2' && <SwipePicker opciones={OPCIONES_DIGITOS} value={idxMillares} onChange={handlePickerChange(setIdxMillares)} />}
                        {dificultad >= '1' && <SwipePicker opciones={OPCIONES_DIGITOS} value={idxCentenas} onChange={handlePickerChange(setIdxCentenas)} />}
                        <SwipePicker opciones={OPCIONES_DIGITOS} value={idxDecenas} onChange={handlePickerChange(setIdxDecenas)} />
                        <SwipePicker opciones={OPCIONES_DIGITOS} value={idxUnidades} onChange={handlePickerChange(setIdxUnidades)} />
                    </div>
                </div>
            </main>

            <footer className="actividad-footer">
                <button className="btn-corregir-full hover-primary" onClick={validarEjercicio}>
                    {TEXTOS.global.corregir}
                </button>
            </footer>
        </ActividadLayout>
    );
}