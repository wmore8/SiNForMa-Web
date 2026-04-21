import { useState } from 'react';
import { ActividadControles } from '../shared/components/ActividadControles';
import { Header } from '../shared/components/Header';
import { TecladoBase8 } from '../shared/components/TecladoBase8';
import { MiNumero } from '../shared/utils/MiNumero';
import '../styles/ActividadOperaciones.css';

const generarRecortados = () => {
    // Generamos: 3 cifras x 2 cifras (Base 8)
    const val1 = Math.floor(Math.random() * (512 - 64)) + 64;
    const val2 = Math.floor(Math.random() * (64 - 8)) + 8;

    const str1 = val1.toString(8).padStart(3, '0');
    const str2 = val2.toString(8).padStart(2, '0');

    // Descomponemos matematicamente
    const v1C = parseInt(str1[0], 8) * 64; // Centenas
    const v1D = parseInt(str1[1], 8) * 8;  // Decenas
    const v1U = parseInt(str1[2], 8);      // Unidades

    const v2D = parseInt(str2[0], 8) * 8;  // Decenas del multiplicador
    const v2U = parseInt(str2[1], 8);      // Unidades del multiplicador

    return {
        // Textos de la operacion original
        str1Original: str1,
        str2Original: str2,

        // Textos a mostrar en los encabezados (convertidos a Base 8)
        lbl1C: v1C.toString(8),
        lbl1D: v1D.toString(8),
        lbl1U: v1U.toString(8),
        lbl2D: v2D.toString(8),
        lbl2U: v2U.toString(8),

        // Soluciones esperadas en Base 8
        soluciones: {
            s13: (v1C * v2U).toString(8),
            s12: (v1D * v2U).toString(8),
            s11: (v1U * v2U).toString(8),
            s1: (val1 * v2U).toString(8), // Total Fila Unidades

            s23: (v1C * v2D).toString(8),
            s22: (v1D * v2D).toString(8),
            s21: (v1U * v2D).toString(8),
            s2: (val1 * v2D).toString(8), // Total Fila Decenas

            sT: (val1 * val2).toString(8) // Total Final
        }
    };
};

export function ActividadRecortados() {
    const [ejercicio, setEjercicio] = useState(() => generarRecortados());

    const celdasVacias = { s13: '', s12: '', s11: '', s1: '', s23: '', s22: '', s21: '', s2: '', sT: '' };
    const [celdas, setCeldas] = useState(celdasVacias);
    const [feedback, setFeedback] = useState(celdasVacias);

    const [celdaActiva, setCeldaActiva] = useState(null);

    const reiniciarTodo = () => {
        setEjercicio(generarRecortados());
        setCeldas(celdasVacias);
        setFeedback(celdasVacias);
        setCeldaActiva(null);
    };

    const handleTeclaClick = (tecla) => {
        if (tecla === 'CLEAR') {
            setCeldas(celdasVacias);
            setFeedback(celdasVacias);
            setCeldaActiva(null);
            return;
        }

        if (!celdaActiva) return;

        setCeldas(prev => {
            const valorActual = prev[celdaActiva];
            let nuevoValor = valorActual;

            if (tecla === 'DEL') {
                // Borramos el ultimo caracter usando slice
                nuevoValor = valorActual.slice(0, -1);
            } else {
                // Limite de 6 caracteres maximo para que no desborde la celda
                if (valorActual.length < 6) {
                    nuevoValor = valorActual + tecla;
                }
            }
            return { ...prev, [celdaActiva]: nuevoValor };
        });

        // Limpiamos el color de feedback si el usuario edita la celda
        setFeedback(prev => ({ ...prev, [celdaActiva]: '' }));
    };

    const aSimbolo = (strBase8) => {
        if (!strBase8 || strBase8 === '0') return new MiNumero(0).toString();
        return strBase8.split('').map(c => new MiNumero(parseInt(c, 10)).toString()).join('');
    };

    const renderCelda = (id) => {
        const valor = celdas[id];
        const isActive = celdaActiva === id;
        const feed = feedback[id];
        const estaLlena = (valor !== '' && feed === '') ? 'llena' : '';

        return (
            <div
                key={id}
                className={`celda-ancha ${estaLlena} ${isActive ? 'activa' : ''} ${feed}`}
                onClick={() => setCeldaActiva(id)}
            >
                {valor !== '' ? aSimbolo(valor) : ''}
            </div>
        );
    };

    const validarEjercicio = () => {
        let todoCorrecto = true;
        const nuevoFeedback = { ...feedback };

        Object.keys(ejercicio.soluciones).forEach(id => {
            const esperado = ejercicio.soluciones[id];
            const usuarioStr = celdas[id].replace(/^0+/, '') || '0';
            const esperadoLimpiado = esperado.replace(/^0+/, '') || '0';

            if (usuarioStr === esperadoLimpiado || (celdas[id] === '' && esperadoLimpiado === '0')) {
                nuevoFeedback[id] = 'correcta';
            } else {
                nuevoFeedback[id] = 'erronea';
                todoCorrecto = false;
            }
        });

        setFeedback(nuevoFeedback);
        setCeldaActiva(null);

        if (todoCorrecto) {
            alert('¡Impresionante! Has dominado los Recortados.');
        } else {
            alert('Hay casillas rojas. Fíjate bien en la tabla de multiplicar.');
        }
    };

    return (
        <div className="actividad-layout multiplicacion-layout-custom modo-dificil">
            <Header rutas={[
                { label: 'Actividad operaciones', path: '/operaciones' },
                { label: 'Multiplicaciones', path: '/operaciones/multiplicaciones' },
                { label: 'Recortados' }]}
                backPath="/operaciones/multiplicaciones" />

            <ActividadControles
                dificultad={0}
                opciones={[{ id: 0, label: "Nivel Único (3x2 Cifras)" }]}
                onChange={() => { }}
                onReiniciar={reiniciarTodo}
                onInfoClick={() => alert("Multiplica el número de la izquierda por los de arriba y pon el resultado en las casillas.")}
            />

            <main className="actividad-zona-juego">

                <div className="container-recortados">

                    <div className="operacion-original-recortados">
                        {aSimbolo(ejercicio.str1Original)} <span className="signo-primario">×</span> {aSimbolo(ejercicio.str2Original)}
                    </div>

                    <div className="recortados-grid">

                        {/* ENCABEZADOS DE COLUMNA */}
                        <div className="etiqueta-recortado signo-primario">×</div> {/* Signo en la esquina superior izquierda */}
                        <div className="etiqueta-recortado">{aSimbolo(ejercicio.lbl1C)}</div>
                        <div className="etiqueta-recortado">{aSimbolo(ejercicio.lbl1D)}</div>
                        <div className="etiqueta-recortado">{aSimbolo(ejercicio.lbl1U)}</div>
                        <div></div> {/* Hueco del total vacio */}

                        <div className="linea-horizontal-grid"></div>

                        {/* FILA 1 (Multiplicado por las Decenas */}
                        <div className="etiqueta-recortado">{aSimbolo(ejercicio.lbl2D)}</div>
                        {renderCelda('s23')}
                        {renderCelda('s22')}
                        {renderCelda('s21')}
                        {renderCelda('s2')} {/* Total Fila Decenas */}

                        {/* FILA 2 (Multiplicado por las Unidades */}
                        <div className="etiqueta-recortado">{aSimbolo(ejercicio.lbl2U)}</div>
                        {renderCelda('s13')}
                        {renderCelda('s12')}
                        {renderCelda('s11')}
                        {renderCelda('s1')} {/* Total Fila Unidades */}

                        <div className="linea-horizontal-grid"></div>

                        {/* FILA DEL TOTAL */}
                        <div></div><div></div><div></div>
                        <div className="etiqueta-recortado signo-primario">=</div>
                        {renderCelda('sT')}

                    </div>
                </div>

                {/* EL PANEL LATERAL*/}
                <div className="panel-derecho-dificil">
                    <TecladoBase8 onTeclaClick={handleTeclaClick} />
                    <button className="btn-corregir-full hover-primary" onClick={validarEjercicio}>
                        Corregir
                    </button>
                </div>

            </main>
        </div>
    );
}