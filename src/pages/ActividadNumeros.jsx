import { useState } from 'react';
import { MiNumero } from '../shared/utils/MiNumero';
import { SwipePicker } from '../shared/components/SwipePicker';
import { Header } from '../shared/components/Header';
import { ActividadControles } from '../shared/components/ActividadControles';

const OPCIONES_NIVELES = [
    { id: 0, from: 1, incr: 1, asc: true, label: "De ro en ro (Ascendente)", sec: "+ ro" },
    { id: 1, from: 1, incr: 2, asc: true, label: "De mes en mes (Ascendente)", sec: "+ mes" },
    { id: 2, from: 0, incr: 2, asc: true, label: "Pares (Ascendente)", sec: "+ mes" },
    { id: 3, from: 0, incr: 4, asc: true, label: "De cleta en cleta (Ascendente)", sec: "+ cleta" },
    { id: 4, from: 0, incr: 8, asc: true, label: "De moel en moel (Ascendente)", sec: "+ moel" },
    { id: 5, from: -1, incr: 1, asc: true, label: "Aleatorio + ro (Ascendente)", sec: "+ ro" },
    { id: 6, from: -1, incr: 1, asc: false, label: "Aleatorio − ro (Descendente)", sec: "− ro" },
    { id: 7, from: -1, incr: 2, asc: true, label: "Aleatorio + mes (Ascendente)", sec: "+ mes" },
    { id: 8, from: -1, incr: 4, asc: true, label: "Aleatorio + cleta (Ascendente)", sec: "+ cleta" },
    { id: 9, from: -1, incr: 8, asc: true, label: "Aleatorio + moel (Ascendente)", sec: "+ moel" }
];

// Arrays de opciones para los Pickers (Basado en MiNumero.java)
const DIGITOS = MiNumero.losDigitos;
const OPCIONES_UNIDADES = [...DIGITOS]; // 0 a 7
const OPCIONES_DECENAS = [' ', ...DIGITOS]; // Blanco + 0 a 7
const OPCIONES_CENTENAS = [' ', ...DIGITOS.slice(1)]; // Blanco + 1 a 7

export function ActividadNumeros() {
    const [dificultad, setDificultad] = useState(0);

    const generarSecuencia = (idOpcion) => {
        const opc = OPCIONES_NIVELES[idOpcion];
        let howMany = Math.floor(Math.random() * 11) + 5;
        let fromNum = opc.from;
        let toNum, curNum, prevNum;

        if (opc.asc) {
            if (fromNum === -1) fromNum = Math.floor(Math.random() * (512 - howMany * opc.incr));
            curNum = fromNum;
            toNum = fromNum + howMany * opc.incr;
            prevNum = fromNum - opc.incr;
        } else {
            if (fromNum === -1) fromNum = Math.floor(Math.random() * (512 - howMany * opc.incr)) + howMany * opc.incr;
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

        if (strUsuario === strCorrecto) { // Si termina la secuencia mostramos el mensaje
            if (ejercicio.curNum === ejercicio.toNum) {
                alert("¡Secuencia Completada! :D");
                setEjercicio(prev => ({ ...prev, finalizado: true, prevNum: prev.curNum }));
            } else { // Si aun quedan numeros, avisamos y seguimos avanzando
                alert("¡Correcto! Introduce el siguiente número.");

                setEjercicio(prev => ({
                    ...prev,
                    prevNum: prev.curNum,
                    curNum: prev.asc ? prev.curNum + prev.incr : prev.curNum - prev.incr
                }));
                // resetPickers();
            }
        } else { //si se equivoca avisamos
            alert("Prueba otra vez :(");
        }
    };

    return (
        <div className="actividad-layout">
            <Header rutas={[{ label: `Actividad Números (${OPCIONES_NIVELES[dificultad].sec})` }]} backPath="/" />

            <ActividadControles dificultad={dificultad} onChange={cambiarDificultad} onReiniciar={() => reiniciarJuego(dificultad)} opciones={OPCIONES_NIVELES} />

            <main className="actividad-zona-juego">
                <div className="info-secuencia">
                    Números desde <strong>{new MiNumero(ejercicio.fromNum, 10).toLongString()}</strong> hasta <strong>{new MiNumero(ejercicio.toNum, 10).toLongString()}</strong>
                </div>

                <div className="pantalla-objetivo">
                    <p className="etiqueta">Último número:</p>
                    <div className="palabra-actual">
                        {new MiNumero(ejercicio.prevNum, 10).toLongString()}
                    </div>
                </div>

                {/* CONTENEDOR DE PICKERS MODULARIZADOS */}
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
                    {ejercicio.finalizado ? "¡Completado!" : "Siguiente"}
                </button>
            </footer>
        </div>
    );
}