import { useState } from 'react';
import { SwipePicker } from '../shared/components/SwipePicker';
import { MiNumero } from '../shared/utils/MiNumero';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { TEXTOS } from '../constants/textos';
import '../styles/ActividadOperaciones.css';

const OPCIONES_DIGITOS = [' ', ...MiNumero.losDigitos];

const generarDivision = (nivel) => {
    const rand = (max) => Math.floor(Math.random() * max);
    let val1 = 0; // Dividendo (Base 10)
    let val2 = 1; // Divisor (Base 10)

    if (nivel === '0') {
        // Facil: 1 cifra / 1 cifra (divisor siempre > 0)
        val1 = rand(MiNumero.baseActual);
        val2 = rand(MiNumero.baseActual - 1) + 1;
    } else if (nivel === '1') {
        const base = MiNumero.baseActual;
        const minVal = base;
        const maxVal = base * base;

        // Generamos dos numeros para que la division sea exacta (dividendo = divisor * cociente)
        const divisor = Math.floor(Math.random() * (base - 2)) + 2; // de 2 al maximo de base (ej: 2 a 7)
        const cociente = Math.floor(Math.random() * (maxVal - minVal)) + minVal; 
        const dividendo = divisor * cociente;

        return {
            num1Str: dividendo.toString(base), 
            num2Str: divisor.toString(base),
            solucionStr: cociente.toString(base)
        };
    } else {
        // Dificil: 3 cifras / 2 cifras
        const base = MiNumero.baseActual;
        val1 = rand(Math.pow(base, 3));
        val2 = rand(Math.pow(base, 2) - 1) + 1;
        const resultadoDecimal = Math.floor(val1 / val2);
        return {
            num1Str: val1.toString(base),
            num2Str: val2.toString(base),
            solucionStr: resultadoDecimal.toString(base)
        };
    }

    // Division entera (sin decimales)
    const resultadoDecimal = Math.floor(val1 / val2);

    return {
        num1Str: val1.toString(MiNumero.baseActual),
        num2Str: val2.toString(MiNumero.baseActual),
        solucionStr: resultadoDecimal.toString(MiNumero.baseActual)
    };
};

export function ActividadDivisiones() {
    const [dificultad, setDificultad] = useState('0');
    const [ejercicio, setEjercicio] = useState(() => generarDivision('0'));

    // Para la division, el maximo resultado de 777 / 1 es 777 (3 cifras como maximo)
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
        setEjercicio(generarDivision(nuevoNivel));
        resetearPickers();
    };

    const reiniciarJuego = () => {
        setEjercicio(generarDivision(dificultad));
        resetearPickers();
    };

    const resetearPickers = () => {
        setIdxCentenas(0);
        setIdxDecenas(0);
        setIdxUnidades(0);
        setEstadoRespuesta('idle');
    };

    const validarEjercicio = () => {
        const c = idxCentenas > 0 ? (idxCentenas - 1).toString() : '';
        const d = idxDecenas > 0 ? (idxDecenas - 1).toString() : '';
        const u = idxUnidades > 0 ? (idxUnidades - 1).toString() : '0';

        let respuestaNumStr = `${c}${d}${u}`.trim().replace(/^0+/, '') || '0';

        if (respuestaNumStr === ejercicio.solucionStr) {
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

    // Helper para convertir un string base 8 en simbolos Romescos
    const renderizarSimbolos = (strBase8) => {
        return strBase8.split('').map((char, i) => (
            <span key={i}>{new MiNumero(parseInt(char, 10)).toString()}</span>
        ));
    };

    return (
        <ActividadLayout
            rutas={[
                { label: TEXTOS.titulos.operaciones, path: '/operaciones' },
                { label: TEXTOS.titulos.divisiones }
            ]}
            backPath="/operaciones"
            dificultad={dificultad}
            onChangeDificultad={cambiarDificultad}
            onReiniciar={reiniciarJuego}
            textoInfo={TEXTOS.infoActividades.divisiones}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={() => setMostrarFeedback(false)}
        >
            <main className="actividad-zona-juego">
                <div className={`operacion-horizontal ${estadoRespuesta}`}>
                    {/* Dividendo */}
                    <div className="numero-fijo">
                        {renderizarSimbolos(ejercicio.num1Str)}
                    </div>

                    <div className="signo-matematico">÷</div>
                    {/* Divisor */}
                    <div className="numero-fijo">
                        {renderizarSimbolos(ejercicio.num2Str)}
                    </div>

                    <div className="signo-matematico">=</div>
                    {/* Pickers: Aparecen segun la dificultad */}
                    <div className="fila-pickers-horizontal">
                        {dificultad >= '1' && <SwipePicker opciones={OPCIONES_DIGITOS} value={idxCentenas} onChange={handlePickerChange(setIdxCentenas)} />}
                        {dificultad >= '1' && <SwipePicker opciones={OPCIONES_DIGITOS} value={idxDecenas} onChange={handlePickerChange(setIdxDecenas)} />}
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