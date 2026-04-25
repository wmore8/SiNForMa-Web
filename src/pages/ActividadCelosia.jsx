import { useState } from 'react';
import { ActividadControles } from '../shared/components/ActividadControles';
import { Header } from '../shared/components/Header';
import { TecladoBase8 } from '../shared/components/TecladoBase8';
import { MiNumero } from '../shared/utils/MiNumero';
import '../styles/ActividadOperaciones.css';

const generarCelosia = () => {
    // 3 cifras x 2 cifras
    const val1 = Math.floor(Math.random() * (512 - 64)) + 64;
    const val2 = Math.floor(Math.random() * (64 - 8)) + 8;

    const str1 = val1.toString(8).padStart(3, '0');
    const str2 = val2.toString(8).padStart(2, '0');

    let soluciones = {};

    // Calcular la cuadricula interior (Decenas y Unidades en Romesco)
    for (let i = 0; i < 2; i++) { // Filas (multiplicador)
        for (let j = 0; j < 3; j++) { // Columnas (multiplicando)
            const p = parseInt(str1[j], 8) * parseInt(str2[i], 8); // Multiplicamos los digitos en decimal
            //los almacenamos y parseamos a Romesco 
            soluciones[`c_${i}_${j}_d`] = Math.floor(p / 8).toString();
            soluciones[`c_${i}_${j}_u`] = (p % 8).toString();
        }
    }

    // Calcular el resultado final esperado en cada casilla
    const resTotal = (val1 * val2).toString(8).padStart(5, '0');
    for (let i = 0; i < 5; i++) {
        soluciones[`r_${i}`] = resTotal[i];
    }
    //aprovechamos y guardamos todas las soluciones en la solucion total
    soluciones[`solTotal`] = resTotal;

    return { str1, str2, soluciones };
};

export function ActividadCelosia() {
    const [ejercicio, setEjercicio] = useState(() => generarCelosia());

    // Creamos el estado inicial vacío de forma dinamica
    const getCeldasVacias = () => {
        let v = {};
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                v[`c_${i}_${j}_d`] = ''; v[`c_${i}_${j}_u`] = '';
            }
        }
        for (let i = 0; i < 5; i++) v[`r_${i}`] = '';
        v[`solTotal`] = '';
        return v;
    };

    //Estados de las casillas
    const [celdas, setCeldas] = useState(getCeldasVacias());
    const [feedback, setFeedback] = useState(getCeldasVacias());
    const [celdaActiva, setCeldaActiva] = useState(null);

    const reiniciarTodo = () => {
        setEjercicio(generarCelosia());
        setCeldas(getCeldasVacias());
        setFeedback(getCeldasVacias());
        setCeldaActiva(null);
    };

    const handleTeclaClick = (tecla) => {
        if (tecla === 'CLEAR') {
            setCeldas(getCeldasVacias());
            setFeedback(getCeldasVacias());
            setCeldaActiva(null);
            return;
        }

        if (!celdaActiva) return;

        setCeldas(prev => {
            const valorActual = prev[celdaActiva];
            let nuevoValor = valorActual;

            if (tecla === 'DEL') {
                nuevoValor = valorActual.slice(0, -1);
            } else {
                // Si es el input del TOTAL, permitimos hasta 5 caracteres
                if (celdaActiva === 'solTotal') {
                    if (valorActual.length < 5) nuevoValor = valorActual + tecla;
                } else {
                    // Si es una casilla pequeña de la celosía, solo 1 caracter
                    nuevoValor = tecla;
                }
            }
            return { ...prev, [celdaActiva]: nuevoValor };
        });

        setFeedback(prev => ({ ...prev, [celdaActiva]: '' }));
    };

    const aSimbolo = (strBase8) => {
        if (!strBase8 || strBase8 === '0') return new MiNumero(0).toString();
        return strBase8.split('').map(c => new MiNumero(parseInt(c, 10)).toString()).join('');
    };

    const renderInputCelosia = (id, tipo) => {
        const valor = celdas[id];
        const isActive = celdaActiva === id;
        const feed = feedback[id];
        const estaLlena = (valor !== '' && feed === '') ? 'llena' : '';

        return (
            <div className={`celosia-input ${tipo} ${estaLlena} ${isActive ? 'activa' : ''} ${feed}`} onClick={() => setCeldaActiva(id)}>
                {valor !== '' ? aSimbolo(valor) : ''}
            </div>
        );
    };

    // funcion para renderizar la casilla
    const renderResultado = (id) => {
        const valor = celdas[id];
        const isActive = celdaActiva === id;
        const feed = feedback[id];
        const estaLlena = (valor !== '' && feed === '') ? 'llena' : '';

        return (
            <div className="celosia-etiqueta">
                <div className={`celosia-resultado-input ${estaLlena} ${isActive ? 'activa' : ''} ${feed}`} onClick={() => setCeldaActiva(id)} >
                    {valor !== '' ? aSimbolo(valor) : ''}
                </div>
            </div>
        );
    };

    const validarEjercicio = () => {
        let todoCorrecto = true;
        const nuevoFeedback = { ...feedback };

        Object.keys(ejercicio.soluciones).forEach(id => {
            const esperado = ejercicio.soluciones[id];
            let usuario = celdas[id];

            // Flexibilidad para el 0 a la izquierda
            if ((id.startsWith('r_') || id === 'solTotal') && esperado.startsWith('0') && usuario === esperado.slice(1)) {
                usuario = esperado; // Lo damos por bueno si se comio el 0 a la izquierda
            } else if (usuario === '') {
                usuario = ' ';
            }

            if (usuario === esperado) {
                nuevoFeedback[id] = 'correcta';
            } else {
                nuevoFeedback[id] = 'erronea';
                todoCorrecto = false;
            }
        });

        setFeedback(nuevoFeedback);
        setCeldaActiva(null);

        if (todoCorrecto) {
            alert('¡Impresionante! Has resuelto la Celosía perfecta.');
        } else {
            alert('Hay casillas rojas. Revisa las multiplicaciones y las sumas.');
        }
    };

    // Helper para el cajetin del Total
    const valTotal = celdas['solTotal'];
    const actTotal = celdaActiva === 'solTotal';
    const feedTotal = feedback['solTotal'];
    const llenaTotal = (valTotal !== '' && feedTotal === '') ? 'llena' : '';

    return (
        <div className="actividad-layout multiplicacion-layout-custom modo-dificil">
            <Header rutas={[
                { label: 'Actividad operaciones', path: '/operaciones' },
                { label: 'Multiplicaciones', path: '/operaciones/multiplicaciones' },
                { label: 'Celosía' }]}
                backPath="/operaciones/multiplicaciones" />

            <ActividadControles
                dificultad={0}
                opciones={[{ id: 0, label: "Nivel Único" }]}
                onChange={() => { }}
                onReiniciar={reiniciarTodo}
                onInfoClick={() => alert("Multiplica cada cifra y suma las diagonales para obtener el resultado final.")}
            />

            <main className="actividad-zona-juego">

                <div className='panel-izquierdo celosia'>

                    <div className="operacion-original">
                        <span>
                            {aSimbolo(ejercicio.str1)} <span className="signo-primario">×</span> {aSimbolo(ejercicio.str2)}
                        </span>
                        <span className="signo-primario">=</span>
                        <div className={`caja-total ${llenaTotal} ${actTotal ? 'activa' : ''} ${feedTotal}`} onClick={() => setCeldaActiva('solTotal')}>
                            {valTotal !== '' ? aSimbolo(valTotal) : ''}
                        </div>
                    </div>

                    <div className='container-recortados'>
                        <div className="celosia-grid">

                            {/* FILA 0: Encabezados Superiores */}
                            <div className="celosia-etiqueta"></div> {/* Hueco vacio */}
                            <div className="celosia-etiqueta con-borde">{aSimbolo(ejercicio.str1[0])}</div>
                            <div className="celosia-etiqueta con-borde">{aSimbolo(ejercicio.str1[1])}</div>
                            <div className="celosia-etiqueta con-borde">{aSimbolo(ejercicio.str1[2])}</div>
                            <div className="celosia-etiqueta signo">×</div>

                            {/* FILA 1: Multiplicador 1 */}
                            {renderResultado('r_0')}
                            <div className="celosia-celda">{renderInputCelosia('c_0_0_d', 'decena')}{renderInputCelosia('c_0_0_u', 'unidad')}</div>
                            <div className="celosia-celda">{renderInputCelosia('c_0_1_d', 'decena')}{renderInputCelosia('c_0_1_u', 'unidad')}</div>
                            <div className="celosia-celda">{renderInputCelosia('c_0_2_d', 'decena')}{renderInputCelosia('c_0_2_u', 'unidad')}</div>
                            <div className="celosia-etiqueta con-borde">{aSimbolo(ejercicio.str2[0])}</div>

                            {/* FILA 2: Multiplicador 2 */}
                            {renderResultado('r_1')}
                            <div className="celosia-celda">{renderInputCelosia('c_1_0_d', 'decena')}{renderInputCelosia('c_1_0_u', 'unidad')}</div>
                            <div className="celosia-celda">{renderInputCelosia('c_1_1_d', 'decena')}{renderInputCelosia('c_1_1_u', 'unidad')}</div>
                            <div className="celosia-celda">{renderInputCelosia('c_1_2_d', 'decena')}{renderInputCelosia('c_1_2_u', 'unidad')}</div>
                            <div className="celosia-etiqueta con-borde">{aSimbolo(ejercicio.str2[1])}</div>

                            {/* FILA 3: Resultados Inferiores */}
                            <div className="celosia-etiqueta"></div> {/* Hueco vacio */}
                            {renderResultado('r_2')}
                            {renderResultado('r_3')}
                            {renderResultado('r_4')}
                            <div className="celosia-etiqueta"></div> {/* Hueco vacio */}

                        </div>

                    </div>
                </div>

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