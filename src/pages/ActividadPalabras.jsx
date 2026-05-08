import { useState, useRef, useEffect } from 'react';
import { MiNumero } from '../shared/utils/MiNumero';
import { Header } from '../shared/components/Header';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { TEXTOS } from '../constants/textos';

const getOpcionesNiveles = () => {
    const base = MiNumero.baseActual;
    const mitad = Math.floor(base / 2);
    const n = (num) => new MiNumero(num, 10);
    const sym = (num) => n(num).toString();
    
    return [
        { id: 0, from: 1, incr: 1, asc: true, label: `De ${sym(1)} en ${sym(1)} (Ascendente)`, sec: `+${sym(1)}` },
        { id: 1, from: 1, incr: 2, asc: true, label: `De ${sym(2)} en ${sym(2)} (Ascendente)`, sec: `+${sym(2)}` },
        { id: 2, from: 0, incr: 2, asc: true, label: "Pares (Ascendente)", sec: `+${sym(2)}` },
        { id: 3, from: 0, incr: mitad, asc: true, label: `De ${sym(mitad)} en ${sym(mitad)} (Ascendente)`, sec: `+${sym(mitad)}` },
        { id: 4, from: 0, incr: base, asc: true, label: `De ${sym(base)} en ${sym(base)} (Ascendente)`, sec: `+${sym(base)}` },
        { id: 5, from: -1, incr: 1, asc: true, label: `Aleatorio +${sym(1)} (Ascendente)`, sec: `+${sym(1)}` },
        { id: 6, from: -1, incr: 1, asc: false, label: `Aleatorio −${sym(1)} (Descendente)`, sec: `−${sym(1)}` },
        { id: 7, from: -1, incr: 2, asc: true, label: `Aleatorio +${sym(2)} (Ascendente)`, sec: `+${sym(2)}` },
        { id: 8, from: -1, incr: mitad, asc: true, label: `Aleatorio +${sym(mitad)} (Ascendente)`, sec: `+${sym(mitad)}` },
        { id: 9, from: -1, incr: base, asc: true, label: `Aleatorio +${sym(base)} (Ascendente)`, sec: `+${sym(base)}` }
    ];
};

// Normaliza un texto: minusculas y sin tildes/diacriticos
// Permite que "dieciseis" sea aceptado como "dieciséis", etc.
const normalizarTexto = (texto) =>
    texto.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function ActividadPalabras() {
    const [dificultad, setDificultad] = useState(0);
    const inputRef = useRef(null);

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
    const [inputUsuario, setInputUsuario] = useState("");

    const reiniciarJuego = (idOpcion = dificultad) => {
        setEjercicio(generarSecuencia(idOpcion));
        setInputUsuario("");
        if (inputRef.current) inputRef.current.focus({ preventScroll: true, focusVisible: false });
    };

    // Foco inicial sin mostrar el borde amarillo
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus({ preventScroll: true, focusVisible: false });
    }, []);

    const cambiarDificultad = (e) => {
        const nuevoNivel = parseInt(e.target.value);
        setDificultad(nuevoNivel);
        reiniciarJuego(nuevoNivel);
    };

    const validarPaso = (e) => {
        e.preventDefault();
        // Parseamos el numero del input
        const miNumCorrecto = new MiNumero(ejercicio.curNum, 10);
        const palabraCorrecta = normalizarTexto(miNumCorrecto.toLongString());
        const palabraUsuario = normalizarTexto(inputUsuario);

        if (palabraUsuario === palabraCorrecta) {
            if (ejercicio.curNum === ejercicio.toNum) { // Si termina la secuencia mostramos el mensaje
                setEsCorrecto(true);
                setMensajeFeedback(TEXTOS.feedback.exitoSecuenciaFin);
                setMostrarFeedback(true);
                setEjercicio(prev => ({ ...prev, finalizado: true, prevNum: prev.curNum }));
            } else { // Si aun quedan numeros, avisamos y seguimos avanzando
                setEsCorrecto(true);
                setMensajeFeedback(TEXTOS.feedback.exitoSecuenciaPal);
                setMostrarFeedback(true);

                setEjercicio(prev => ({
                    ...prev,
                    prevNum: prev.curNum,
                    curNum: prev.asc ? prev.curNum + prev.incr : prev.curNum - prev.incr
                }));
                setInputUsuario("");
            }
        } else { //si se equivoca avisamos
            setEsCorrecto(false);
            setMensajeFeedback(TEXTOS.feedback.errorSecuencia);
            setMostrarFeedback(true);
        }
    };

    const handleCerrarFeedback = () => {
        setMostrarFeedback(false);
        if (!ejercicio.finalizado && inputRef.current) {
            setTimeout(() => inputRef.current.focus({ preventScroll: true, focusVisible: false }), 100);
        }
    };

    return (
        <ActividadLayout
            rutas={[{ label: `${TEXTOS.titulos.palabras} ${getOpcionesNiveles()[dificultad].sec}`, icon: 'icon-palabras' }]}
            backPath="/"
            dificultad={dificultad}
            opcionesDificultad={getOpcionesNiveles()}
            onChangeDificultad={cambiarDificultad}
            onReiniciar={() => reiniciarJuego(dificultad)}
            textoInfo={TEXTOS.infoActividades.secuenciasPal}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={handleCerrarFeedback}
            mensajeExito={mensajeFeedback}
            mensajeError={mensajeFeedback}
        >
            <main className="actividad-zona-juego">
                <div className="info-secuencia">
                    {TEXTOS.ui.secuencias.palabrasDesde} <strong>{new MiNumero(ejercicio.fromNum, 10).toString()}</strong> {TEXTOS.ui.secuencias.hasta} <strong>{new MiNumero(ejercicio.toNum, 10).toString()}</strong>
                </div>

                <div className="pantalla-objetivo">
                    <p className="etiqueta">{TEXTOS.ui.secuencias.ultimaPalabra}</p>
                    <div className="simbolo-actual">{ejercicio.prevNum >= 0 ? new MiNumero(ejercicio.prevNum, 10).toString() : ''}</div>
                </div>

                <form className="form-escritura" onSubmit={validarPaso}>
                    <input
                        ref={inputRef}
                        type="text"
                        className="input-palabra"
                        placeholder={TEXTOS.ui.secuencias.placeholderPalabra}
                        value={inputUsuario}
                        onChange={(e) => setInputUsuario(e.target.value)}
                        disabled={ejercicio.finalizado}
                    />
                </form>
            </main>

            <footer className="actividad-footer">
                <button className="btn-primario btn-corregir-full" onClick={validarPaso} disabled={ejercicio.finalizado || !inputUsuario}>
                    {ejercicio.finalizado ? TEXTOS.global.completado : TEXTOS.global.siguiente}
                </button>
            </footer>
        </ActividadLayout>
    );
}