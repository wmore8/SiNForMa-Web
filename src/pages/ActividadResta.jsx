import { useState } from 'react';
import { SwipePicker } from '../shared/components/SwipePicker';
import { MiNumero } from '../shared/utils/MiNumero';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { TEXTOS } from '../constants/textos';
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
    const [dificultad, setDificultad] = useState('0');
    const [ejercicio, setEjercicio] = useState(() => generarResta('0'));
    // Estados de los Pickers
    const [idxSigno, setIdxSigno] = useState(0);
    const [idxCentenas, setIdxCentenas] = useState(0);
    const [idxDecenas, setIdxDecenas] = useState(0);
    const [idxUnidades, setIdxUnidades] = useState(0);
    // Estado visual para el CSS (borde de la caja)
    const [estadoRespuesta, setEstadoRespuesta] = useState('idle');

    // Estados para los modales
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);

    const cambiarDificultad = (e) => {
        const nuevoNivel = e.target.value;
        setDificultad(nuevoNivel);
        setEjercicio(generarResta(nuevoNivel));
        resetearPickers();
    };

    const reiniciarJuego = () => {
        setEjercicio(generarResta(dificultad));
        resetearPickers();
    };

    const resetearPickers = () => {
        setIdxSigno(0);
        setIdxCentenas(0);
        setIdxDecenas(0);
        setIdxUnidades(0);
        setEstadoRespuesta('idle');
    };

    const validarEjercicio = () => {
        const c = idxCentenas > 0 ? (idxCentenas - 1).toString() : '';
        const d = idxDecenas > 0 ? (idxDecenas - 1).toString() : '';
        const u = idxUnidades > 0 ? (idxUnidades - 1).toString() : '0';

        // Juntamos los numeros y limpiamos ceros a la izquierda
        let respuestaNumStr = `${c}${d}${u}`.trim().replace(/^0+/, '') || '0';
        // Comprobamos el signo
        const usuarioPoneNegativo = idxSigno === 1;

        // Validacion doble: Que el numero coincida Y que el signo sea correcto
        const numeroCorrecto = respuestaNumStr === ejercicio.solucionAbsoluta;
        const signoCorrecto = usuarioPoneNegativo === ejercicio.esNegativo;

        // Regla especial: El "0" no es ni positivo ni negativo, perdonamos el signo si la respuesta es 0
        const esCero = ejercicio.solucionAbsoluta === '0' && respuestaNumStr === '0';

        if ((numeroCorrecto && signoCorrecto) || esCero) {
            setEstadoRespuesta('correct');
            setEsCorrecto(true);
        } else {
            setEstadoRespuesta('error');
            setEsCorrecto(false);
        }
        setMostrarFeedback(true);
    };

    const handlePickerChange = (setter) => (val) => {
        setter(val);
        setEstadoRespuesta('idle');
    };

    // Rellena con espacios en blanco para mantener la cuadricula
    const getDigits = (strNum, nivelDificultad) => {
        let length = 2; // Facil: Decenas y Unidades
        if (nivelDificultad >= '1') length = 3; // Medio y Dificil: Max 3 cifras
        return strNum.padStart(length, ' ').split('');
    };

    return (

        <ActividadLayout
            rutas={[
                { label: TEXTOS.titulos.operaciones, path: '/operaciones',icon: 'icon-operaciones' },
                { label: TEXTOS.titulos.resta, icon:'icon-resta' }
            ]}
            backPath="/operaciones"
            dificultad={dificultad}
            onChangeDificultad={cambiarDificultad}
            onReiniciar={reiniciarJuego}
            textoInfo={TEXTOS.infoActividades.resta}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={() => setMostrarFeedback(false)}
        >
            <main className="actividad-zona-juego">
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

                    {/* Pickers */}
                    <div className="fila-operacion fila-pickers">
                        <div className="celda-signo invisible"></div>
                        {dificultad === '2' && <SwipePicker opciones={OPCIONES_SIGNO} value={idxSigno} onChange={handlePickerChange(setIdxSigno)} />}
                        {dificultad >= '1' && <SwipePicker opciones={OPCIONES_DIGITOS} value={idxCentenas} onChange={handlePickerChange(setIdxCentenas)} />}
                        <SwipePicker opciones={OPCIONES_DIGITOS} value={idxDecenas} onChange={handlePickerChange(setIdxDecenas)} />
                        <SwipePicker opciones={OPCIONES_DIGITOS} value={idxUnidades} onChange={handlePickerChange(setIdxUnidades)} />
                    </div>

                </div>
            </main>

            <footer className="actividad-footer">
                <button className="btn-corregir-full" onClick={validarEjercicio}>
                    {TEXTOS.global.corregir}
                </button>
            </footer>
        </ActividadLayout>
    );
}