import { useState } from 'react';
import { TecladoBase } from '../shared/components/TecladoBase';
import { MiNumero } from '../shared/utils/MiNumero';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { TEXTOS } from '../constants/textos';
import { useNavegacionFlechas } from '../shared/hooks/useNavegacionFlechas';
import { useAutoFocoInicial } from '../shared/hooks/useAutoFocoInicial';
import '../styles/ActividadOperaciones.css';

const generarCelosia = () => {
    const base = MiNumero.baseActual;
    const maxVal1 = Math.pow(base, 3);
    const minVal1 = Math.pow(base, 2);
    const maxVal2 = Math.pow(base, 2);
    const minVal2 = base;

    // 3 cifras x 2 cifras
    const val1 = Math.floor(Math.random() * (maxVal1 - minVal1)) + minVal1;
    const val2 = Math.floor(Math.random() * (maxVal2 - minVal2)) + minVal2;

    const str1 = val1.toString(base).padStart(3, '0');
    const str2 = val2.toString(base).padStart(2, '0');

    let soluciones = {};

    // Calcular la cuadricula interior (Decenas y Unidades en la base numerica esperada)
    for (let i = 0; i < 2; i++) { // Filas (multiplicador)
        for (let j = 0; j < 3; j++) { // Columnas (multiplicando)
            const p = parseInt(str1[j], base) * parseInt(str2[i], base); // Multiplicamos los digitos en decimal
            //los almacenamos y parseamos a string
            soluciones[`c_${i}_${j}_d`] = Math.floor(p / base).toString();
            soluciones[`c_${i}_${j}_u`] = (p % base).toString();
        }
    }

    // Calcular el resultado final esperado en cada casilla
    const resTotal = (val1 * val2).toString(base).padStart(5, '0');
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

    // Mapa visual de la Celosia-> Simulamos las posiciones en "zig-zag" de los triangulos
    const navegacionGrid = [
        ['solTotal', 'solTotal', 'solTotal', 'solTotal', 'solTotal'], // La caja total arriba del todo
        [null, 'c_0_0_d', 'c_0_1_d', 'c_0_2_d', null],  // Fila superior (Decenas del Multiplicador 1)
        ['r_0', 'c_0_0_u', 'c_0_1_u', 'c_0_2_u', null],  // Fila inferior (Unidades del Multiplicador 1)
        [null, 'c_1_0_d', 'c_1_1_d', 'c_1_2_d', null],  // Fila superior (Decenas del Multiplicador 2)
        ['r_1', 'c_1_0_u', 'c_1_1_u', 'c_1_2_u', null],  // Fila inferior (Unidades del Multiplicador 2)
        [null, 'r_2', 'r_3', 'r_4', null],  // Resultados perimetrales de abajo
        ['btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir']
    ];

    const handleFlechas = useNavegacionFlechas(navegacionGrid, setCeldaActiva);

    // Auto-focus al Total nada mas entrar
    useAutoFocoInicial(ejercicio, 'celda-solTotal', setCeldaActiva);

    // Estados para los modales
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);

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
            <div
                id={`celda-${id}`}
                className={`celosia-input ${tipo} ${estaLlena} ${isActive ? 'activa' : ''} ${feed}`}
                onClick={() => setCeldaActiva(id)}
                onFocus={() => setCeldaActiva(id)}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCeldaActiva(id); }
                    else handleFlechas(e, id);
                }}
            >
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
                <div
                    id={`celda-${id}`} 
                    className={`celosia-resultado-input ${estaLlena} ${isActive ? 'activa' : ''} ${feed}`}
                    onClick={() => setCeldaActiva(id)}
                    onFocus={() => setCeldaActiva(id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCeldaActiva(id); }
                        else handleFlechas(e, id);
                    }}
                >
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
            setEsCorrecto(true);
        } else {
            setEsCorrecto(false);
        }
        setMostrarFeedback(true);

        // Desenfocamos cualquier celda que tuviera el foco amarillo
        if (document.activeElement) {
            document.activeElement.blur();
        }
    };

    // Helper para el cajetin del Total
    const valTotal = celdas['solTotal'];
    const actTotal = celdaActiva === 'solTotal';
    const feedTotal = feedback['solTotal'];
    const llenaTotal = (valTotal !== '' && feedTotal === '') ? 'llena' : '';

    return (

        <ActividadLayout
            rutas={[
                { label: TEXTOS.titulos.operaciones, path: '/operaciones', icon: 'icon-operaciones' },
                { label: TEXTOS.titulos.multiplicaciones, path: '/operaciones/multiplicaciones', icon: 'icon-multiplicaciones' },
                { label: TEXTOS.titulos.celosia, icon: 'icon-celosia' }
            ]}
            backPath="/operaciones/multiplicaciones"
            dificultad={0}
            opcionesDificultad={[{ id: 0, label: "Nivel Único" }]}
            onChangeDificultad={() => { }}
            onReiniciar={reiniciarTodo}
            textoInfo={TEXTOS.infoActividades.celosia}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={() => setMostrarFeedback(false)}
            mensajeExito={TEXTOS.feedback.exitoCelosia}
            mensajeError={TEXTOS.feedback.errorCelosia}
            className="multiplicacion-layout-custom modo-dificil"
        >
            <main className="actividad-zona-juego">

                <div className='panel-izquierdo celosia'>

                    <div className="operacion-original">
                        <span>
                            {aSimbolo(ejercicio.str1)} <span className="signo-primario">×</span> {aSimbolo(ejercicio.str2)}
                        </span>
                        <span className="signo-primario">=</span>
                        <div
                            id="celda-solTotal"
                            className={`caja-total ${llenaTotal} ${actTotal ? 'activa' : ''} ${feedTotal}`}
                            onClick={() => setCeldaActiva('solTotal')}
                            onFocus={() => setCeldaActiva('solTotal')}
                            tabIndex={0} // <-- Permite el focus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setCeldaActiva('solTotal');
                                } else {
                                    handleFlechas(e, 'solTotal');
                                }
                            }}
                        >
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
                    <TecladoBase onTeclaClick={handleTeclaClick} />
                    <button
                        id="celda-btn-corregir"
                        className="btn-corregir-full hover-primary"
                        onClick={validarEjercicio}
                        onKeyDown={(e) => {
                            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                handleFlechas(e, 'btn-corregir');
                            }
                        }}>
                        {TEXTOS.global.corregir}
                    </button>
                </div>
            </main>
        </ActividadLayout>
    );
}