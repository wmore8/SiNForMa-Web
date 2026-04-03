// src/pages/ActividadPalabras.jsx
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../shared/components/Icon';
import { MiNumero } from '../shared/utils/MiNumero';
import '../styles/ActividadPalabras.css';

const OPCIONES_NIVELES = [
    { id: 0, from: 1, incr: 1, asc: true, label: "De ^ en ^ (Ascendente)", sec: "+ ^" },
    { id: 1, from: 1, incr: 2, asc: true, label: "De ɛ en ɛ (Ascendente)", sec: "+ ɛ" },
    { id: 2, from: 0, incr: 2, asc: true, label: "Pares (Ascendente)", sec: "+ ɛ" },
    { id: 3, from: 0, incr: 4, asc: true, label: "De ƺ en ƺ (Ascendente)", sec: "+ ƺ" },
    { id: 4, from: 0, incr: 8, asc: true, label: "De ^ȹ en ^ȹ (Ascendente)", sec: "+ ^ȹ" },
    { id: 5, from: -1, incr: 1, asc: true, label: "Aleatorio +^ (Ascendente)", sec: "+ ^" },
    { id: 6, from: -1, incr: 1, asc: false, label: "Aleatorio -^ (Descendente)", sec: "− ^" },
    { id: 7, from: -1, incr: 2, asc: true, label: "Aleatorio +ɛ (Ascendente)", sec: "+ ɛ" },
    { id: 8, from: -1, incr: 4, asc: true, label: "Aleatorio +ƺ (Ascendente)", sec: "+ ƺ" },
    { id: 9, from: -1, incr: 8, asc: true, label: "Aleatorio +^ȹ (Ascendente)", sec: "+ ^ȹ" }
];

export function ActividadPalabras() {
    const [dificultad, setDificultad] = useState(0);
    const inputRef = useRef(null);

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
    const [inputUsuario, setInputUsuario] = useState("");

    const reiniciarJuego = (idOpcion = dificultad) => {
        setEjercicio(generarSecuencia(idOpcion));
        setInputUsuario("");
        if (inputRef.current) inputRef.current.focus();
    };

    const cambiarDificultad = (e) => {
        const nuevoNivel = parseInt(e.target.value);
        setDificultad(nuevoNivel);
        reiniciarJuego(nuevoNivel);
    };

    const validarPaso = (e) => {
        e.preventDefault();
        // Parseamos el numero del input
        const miNumCorrecto = new MiNumero(ejercicio.curNum, 10);
        const palabraCorrecta = miNumCorrecto.toLongString().toLowerCase().trim();
        const palabraUsuario = inputUsuario.toLowerCase().trim();

        if (palabraUsuario === palabraCorrecta) {
            if (ejercicio.curNum === ejercicio.toNum) { // Si termina la secuencia mostramos el mensaje
                alert("¡Secuencia Completada! :D");
                setEjercicio(prev => ({ ...prev, finalizado: true, prevNum: prev.curNum }));
            } else { // Si aun quedan numeros seguimos avanzando
                setEjercicio(prev => ({ 
                    ...prev, 
                    prevNum: prev.curNum,
                    curNum: prev.asc ? prev.curNum + prev.incr : prev.curNum - prev.incr 
                }));
                setInputUsuario("");
                inputRef.current.focus();
            }
        } else { //si se equivoca avisamos
            alert("Prueba otra vez :(");
        }
    };

    return (
        <div className="palabras-layout">
            <header className="palabras-header">
                <div className="breadcrumb">
                    <Icon name="icon-default" className="breadcrumb-icon" /> <span>Actividad Palabras ({OPCIONES_NIVELES[dificultad].sec})</span>
                </div>
                <Link to="/" className="icon-btn btn-volver" style={{ color: 'var(--text-color)' }} title="Volver">
                    <Icon name="icon-back" />
                </Link>
            </header>

            <div className="palabras-controles">
                <button className="icon-btn btn-info" style={{ color: 'var(--text-color)' }} title="Información">
                    <Icon name="icon-info" />
                </button>
                <select value={dificultad} className="dificultad-select" onChange={cambiarDificultad}>
                    {OPCIONES_NIVELES.map(opc => (
                        <option key={opc.id} value={opc.id}>{opc.label}</option>
                    ))}
                </select>
                <button className="btn-secundario danger" onClick={() => reiniciarJuego(dificultad)}>Reiniciar</button>
            </div>

            <main className="palabras-zona-juego">
                <div className="info-secuencia">
                    Escribe las palabras desde <strong>{new MiNumero(ejercicio.fromNum, 10).toString()}</strong> hasta <strong>{new MiNumero(ejercicio.toNum, 10).toString()}</strong>
                </div>

                <div className="pantalla-objetivo">
                    <p className="etiqueta">Última palabra:</p>
                    <div className="simbolo-actual">{new MiNumero(ejercicio.prevNum, 10).toString()}</div>
                </div>

                  <form className="form-escritura" onSubmit={validarPaso}>
                    <input 
                        ref={inputRef}
                        type="text" 
                        className="input-palabra"
                        placeholder="Escribe la palabra..."
                        value={inputUsuario}
                        onChange={(e) => setInputUsuario(e.target.value)}
                        disabled={ejercicio.finalizado}
                        autoFocus
                    />
                </form>
            </main>

            <footer className="palabras-footer">
                <button 
                    className="btn-primario btn-corregir-full" 
                    onClick={validarPaso} 
                    disabled={ejercicio.finalizado || !inputUsuario}
                >
                    {ejercicio.finalizado ? "¡Completado!" : "Siguiente"}
                </button>
            </footer>
        </div>
    );
}