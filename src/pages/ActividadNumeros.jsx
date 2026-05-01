import { useState } from 'react';
import { MiNumero } from '../shared/utils/MiNumero';
import { SwipePicker } from '../shared/components/SwipePicker';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { TEXTOS } from '../constants/textos';

const getOpcionesNiveles = () => {
    const base = MiNumero.baseActual;
    const mitad = Math.floor(base / 2);
    const n = (num) => new MiNumero(num, 10);
    const word = (num) => n(num).toLongString();
    
    return [
        { id: 0, from: 1, incr: 1, asc: true, label: `De ${word(1)} en ${word(1)} (Ascendente)`, sec: `+ ${word(1)}` },
        { id: 1, from: 1, incr: 2, asc: true, label: `De ${word(2)} en ${word(2)} (Ascendente)`, sec: `+ ${word(2)}` },
        { id: 2, from: 0, incr: 2, asc: true, label: "Pares (Ascendente)", sec: `+ ${word(2)}` },
        { id: 3, from: 0, incr: mitad, asc: true, label: `De ${word(mitad)} en ${word(mitad)} (Ascendente)`, sec: `+ ${word(mitad)}` },
        { id: 4, from: 0, incr: base, asc: true, label: `De ${word(base)} en ${word(base)} (Ascendente)`, sec: `+ ${word(base)}` },
        { id: 5, from: -1, incr: 1, asc: true, label: `Aleatorio + ${word(1)} (Ascendente)`, sec: `+ ${word(1)}` },
        { id: 6, from: -1, incr: 1, asc: false, label: `Aleatorio − ${word(1)} (Descendente)`, sec: `− ${word(1)}` },
        { id: 7, from: -1, incr: 2, asc: true, label: `Aleatorio + ${word(2)} (Ascendente)`, sec: `+ ${word(2)}` },
        { id: 8, from: -1, incr: mitad, asc: true, label: `Aleatorio + ${word(mitad)} (Ascendente)`, sec: `+ ${word(mitad)}` },
        { id: 9, from: -1, incr: base, asc: true, label: `Aleatorio + ${word(base)} (Ascendente)`, sec: `+ ${word(base)}` }
    ];
};

// Arrays de opciones para los Pickers (Basado en MiNumero.java)
const DIGITOS = MiNumero.losDigitos;
const OPCIONES_UNIDADES = [...DIGITOS]; // 0 a 7
const OPCIONES_DECENAS = [' ', ...DIGITOS]; // Blanco + 0 a 7
const OPCIONES_CENTENAS = [' ', ...DIGITOS.slice(1)]; // Blanco + 1 a 7

export function ActividadNumeros() {
    const [dificultad, setDificultad] = useState(0);

    // Estados para los modales
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);
    const [mensajeFeedback, setMensajeFeedback] = useState("");

    const generarSecuencia = (idOpcion) => {
        const opciones = getOpcionesNiveles();
        const opc = opciones[idOpcion];
        let howMany = Math.floor(Math.random() * 11) + 5;
        let fromNum = opc.from;
        let toNum, curNum, prevNum;

        const limite = Math.pow(MiNumero.baseActual, 3);
        if (opc.asc) {
            if (fromNum === -1) fromNum = Math.floor(Math.random() * (limite - howMany * opc.incr));
            curNum = fromNum;
            toNum = fromNum + howMany * opc.incr;
            prevNum = fromNum - opc.incr;
        } else {
            if (fromNum === -1) fromNum = Math.floor(Math.random() * (limite - howMany * opc.incr)) + howMany * opc.incr;
            curNum = fromNum;
            toNum = fromNum - howMany * opc.incr;
            prevNum = fromNum + opc.incr;
        }

        return { fromNum, toNum, curNum, prevNum, incr: opc.incr, asc: opc.asc, finalizado: false };
    };

    const [ejercicio, setEjercicio] = useState(() => generarSecuencia(0));

    // Estados para los 3 pickers (Guardamos el índice del array)
    const [idxCentenas, setIdxCentenas] = useState(0);
    const [idxDecenas, setIdxDecenas] = useState(0);
    const [idxUnidades, setIdxUnidades] = useState(0);

    const reiniciarJuego = (idOpcion = dificultad) => {
        setEjercicio(generarSecuencia(idOpcion));
        resetPickers();
    };

    const resetPickers = () => {
        setIdxCentenas(0);
        setIdxDecenas(0);
        setIdxUnidades(0);
    };

    const cambiarDificultad = (e) => {
        const nuevoNivel = parseInt(e.target.value);
        setDificultad(nuevoNivel);
        reiniciarJuego(nuevoNivel);
    };

    const validarPaso = () => {
        // Reconstruimos el string seleccionado ignorando espacios en blanco
        const charCentena = OPCIONES_CENTENAS[idxCentenas].trim();
        const charDecena = OPCIONES_DECENAS[idxDecenas].trim();
        const charUnidad = OPCIONES_UNIDADES[idxUnidades].trim();

        const strUsuario = `${charCentena}${charDecena}${charUnidad}`;
        const strCorrecto = new MiNumero(ejercicio.curNum, 10).toString();

        if (strUsuario === strCorrecto) {  // Si termina la secuencia mostramos el mensaje
            if (ejercicio.curNum === ejercicio.toNum) {
                setEsCorrecto(true);
                setMensajeFeedback(TEXTOS.feedback.exitoSecuenciaFin);
                setMostrarFeedback(true);
                setEjercicio(prev => ({ ...prev, finalizado: true, prevNum: prev.curNum }));
            } else { // Si aun quedan numeros, avisamos y seguimos avanzando
                setEsCorrecto(true);
                setMensajeFeedback(TEXTOS.feedback.exitoSecuenciaNum);
                setMostrarFeedback(true);

                setEjercicio(prev => ({
                    ...prev,
                    prevNum: prev.curNum,
                    curNum: prev.asc ? prev.curNum + prev.incr : prev.curNum - prev.incr
                }));
            }
        } else { //si se equivoca avisamos
            setEsCorrecto(false);
            setMensajeFeedback(TEXTOS.feedback.errorSecuencia);
            setMostrarFeedback(true);
        }
    };

    return (
        <ActividadLayout
            rutas={[{ label: `${TEXTOS.titulos.numeros} (${getOpcionesNiveles()[dificultad].sec})` }]}
            backPath="/"
            dificultad={dificultad}
            opcionesDificultad={getOpcionesNiveles()}
            onChangeDificultad={cambiarDificultad}
            onReiniciar={() => reiniciarJuego(dificultad)}
            textoInfo={TEXTOS.infoActividades.secuenciasNum}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={() => setMostrarFeedback(false)}
            mensajeExito={mensajeFeedback}
            mensajeError={mensajeFeedback}
        >
            <main className="actividad-zona-juego">
                <div className="info-secuencia">
                    {TEXTOS.ui.secuencias.numerosDesde} <strong>{new MiNumero(ejercicio.fromNum, 10).toLongString()}</strong> {TEXTOS.ui.secuencias.hasta} <strong>{new MiNumero(ejercicio.toNum, 10).toLongString()}</strong>
                </div>

                <div className="pantalla-objetivo">
                    <p className="etiqueta">{TEXTOS.ui.secuencias.ultimoNumero}</p>
                    <div className="palabra-actual">
                        {new MiNumero(ejercicio.prevNum, 10).toLongString()}
                    </div>
                </div>

                <div className="pickers-container">
                    <SwipePicker
                        opciones={OPCIONES_CENTENAS}
                        value={idxCentenas}
                        onChange={setIdxCentenas}
                    />
                    <SwipePicker
                        opciones={OPCIONES_DECENAS}
                        value={idxDecenas}
                        onChange={setIdxDecenas}
                    />
                    <SwipePicker
                        opciones={OPCIONES_UNIDADES}
                        value={idxUnidades}
                        onChange={setIdxUnidades}
                    />
                </div>
            </main>

            <footer className="numeros-footer">
                <button
                    className="btn-primario btn-corregir-full"
                    onClick={validarPaso}
                    disabled={ejercicio.finalizado}
                >
                    {ejercicio.finalizado ? TEXTOS.global.completado : TEXTOS.global.siguiente}
                </button>
            </footer>
        </ActividadLayout>
    );
}