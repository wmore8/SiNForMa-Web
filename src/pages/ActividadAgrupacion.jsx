import { useState, useCallback, useEffect } from 'react';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { Icon } from '../shared/components/Icon';
import { MiNumero } from '../shared/utils/MiNumero';
import { SwipePicker } from '../shared/components/SwipePicker';
import { TEXTOS } from '../constants/textos';
import "../styles/ActividadAgrupacion.css";

// Generador de IDs unicos simple
let idCounter = 0;
const generateId = () => `obj_${idCounter++}`;

const UNIDADES_NAME = 'palillo-unidad';
const DECENAS_NAME = 'palillo-decena';
const CENTENAS_NAME = 'palillo-centena';

export function ActividadAgrupacion() {
    const base = MiNumero.baseActual;
    // const tipoBase = base === 8 ? 'romescus' : 'decimal';

    const [dificultad, setDificultad] = useState(0);
    // Estado central -> El caos en la "mesa"
    const [itemsMesa, setItemsMesa] = useState([]);
    const [valorRealTotal, setValorRealTotal] = useState(0);
    // Estados de los inputs del usuario en la parte inferior
    const [idxCentenas, setidxCentenas] = useState(0);
    const [idxDecenas, setidxDecenas] = useState(0);
    const [idxUnidades, setidxUnidades] = useState(0);
    // Estados de los mensajes del modal
    const [feedbackAbierto, setFeedbackAbierto] = useState(false);
    const [esRespuestaCorrecta, setEsRespuestaCorrecta] = useState(false);

    const generarNivel = useCallback((nivelDificultad) => {
        setDificultad(nivelDificultad);
        let nuevosItems = [];
        let valorCalculado = 0;

        const addItems = (tipo, cantidad) => {
            for (let i = 0; i < cantidad; i++) {
                nuevosItems.push({ id: generateId(), tipo, seleccionado: false });
            }
        };

        const min_decenas = parseInt((base * 10 / 4)); // lo minimo para sumar 200 
        const min_unidades = parseInt((base * 10 / 4)); // lo minimo para sumar 25

        if (nivelDificultad === 0) {
            // FACIL: 10 / 12 a 30 / 37 palillos sueltos 
            const cant = Math.floor(Math.random() * min_unidades) + Math.floor(min_unidades / 2);
            addItems(UNIDADES_NAME, cant);
            valorCalculado = cant;

        } else if (nivelDificultad === 1) {
            // MEDIO: 40 / 50  a 79 / 99 palillos sueltos
            const cant = Math.floor(Math.random() * ((base * 10 / 2))) + 2 * min_unidades;
            addItems(UNIDADES_NAME, cant);
            valorCalculado = cant;

        } else {
            // DIFICIL: 25 % de palillos sueltos para despistar y hasta 40 o 50 palillos agrupados en decenas para llegar a mas 500
            const cantUnidades = Math.floor(Math.random() * (base * 10 / 4)) + min_unidades; //Entre 20 /25 a 40 / 50 palillos sueltos
            const cantDecenas = Math.floor(Math.random() * (base * 10 / 2)) + min_decenas; // Entre 20 / 25 y 60 / 75 decenas

            addItems(DECENAS_NAME, cantDecenas);
            addItems(UNIDADES_NAME, cantUnidades);
            valorCalculado = parseInt((cantDecenas * base) + cantUnidades);
        }

        // Barajamos los items para que el caos en la mesa sea realista (las decenas se mezclan con las unidades)
        nuevosItems.sort(() => Math.random() - 0.5);

        setItemsMesa(nuevosItems);
        setValorRealTotal(valorCalculado);
        setidxCentenas(0); setidxDecenas(0); setidxUnidades(0);
        setFeedbackAbierto(false);
    }, [base]);

    useEffect(() => { generarNivel(0); }, [generarNivel]);

    const toggleSeleccion = (id) => {
        setItemsMesa(prev => prev.map(item =>
            item.id === id ? { ...item, seleccionado: !item.seleccionado } : item
        ));
    };

    const limpiarSeleccion = () => {
        setItemsMesa(prev => prev.map(item => ({ ...item, seleccionado: false })));
    };

    // --- LOGICA DE SELECCION Y HABILITACION DE BOTONES ---
    const selUnidades = itemsMesa.filter(i => i.seleccionado && i.tipo === UNIDADES_NAME);
    const selDecenas = itemsMesa.filter(i => i.seleccionado && i.tipo === DECENAS_NAME);
    const selCentenas = itemsMesa.filter(i => i.seleccionado && i.tipo === CENTENAS_NAME);

    // Solo habilitar si no hay elementos "diferentes" en la seleccion
    const isAgrupableUnidades = selUnidades.length === base && selDecenas.length === 0 && selCentenas.length === 0;
    const isAgrupableDecenas = selDecenas.length === base && selUnidades.length === 0 && selCentenas.length === 0;

    // El boton agrupar se habilita si cualquiera de las dos condiciones se cumple
    const canAgrupar = isAgrupableUnidades || isAgrupableDecenas;

    // El boton desagrupar requiere que haya al menos un elemento mayor y ninguna unidad suelta seleccionada
    const canDesagrupar = (selDecenas.length > 0 || selCentenas.length > 0) && selUnidades.length === 0;

    // --- FUNCIONES DE ACCION ----
    const ejecutarAgrupacion = () => {
        let tipoOrigen = '';
        let tipoDestino = '';

        if (isAgrupableUnidades) {
            tipoOrigen = UNIDADES_NAME;
            tipoDestino = DECENAS_NAME;
        } else if (isAgrupableDecenas) {
            tipoOrigen = DECENAS_NAME;
            tipoDestino = CENTENAS_NAME;
        }

        if (!tipoOrigen) return; // early return en caso de que no sea agrupable

        let eliminados = 0;
        let nuevosItems = itemsMesa.filter(item => {
            if (item.seleccionado && item.tipo === tipoOrigen && eliminados < base) {
                eliminados++;
                return false; // Lo sacamos de la "mesa"
            }
            return true;
        });
        // Añadimos el nuevo objeto agrupado al principio del array
        nuevosItems.unshift({ id: generateId(), tipo: tipoDestino, seleccionado: false });
        // Limpiamos selecciones restantes por si acaso
        setItemsMesa(nuevosItems.map(i => ({ ...i, seleccionado: false })));
    };

    const ejecutarDesagrupacion = () => {
        let nuevosItems = [];
        itemsMesa.forEach(item => {
            if (item.seleccionado && (item.tipo === DECENAS_NAME || item.tipo === CENTENAS_NAME)) {
                const tipoInferior = item.tipo === CENTENAS_NAME ? DECENAS_NAME : UNIDADES_NAME;
                for (let i = 0; i < base; i++) {
                    nuevosItems.push({ id: generateId(), tipo: tipoInferior, seleccionado: false });
                }
            } else {
                nuevosItems.push({ ...item, seleccionado: false });
            }
        });
        setItemsMesa(nuevosItems);
    };

    const validarEjercicio = () => {
        const inputTotal = (idxCentenas * base * base) + (idxDecenas * base) + idxUnidades;
        setEsRespuestaCorrecta(inputTotal === valorRealTotal);
        // console.log(inputTotal);
        // console.log(valorRealTotal);
        setFeedbackAbierto(true);
    };

    const getIconName = (tipo) => {
        let baseActual = base === 8 ? "romescus" : "decimal";
        if (tipo === UNIDADES_NAME) {
            return "icon-palillo-unidad";
        } else if (tipo === DECENAS_NAME) {
            return `icon-palillo-decena-${baseActual}`;
        } else {
            return `icon-palillo-centena-${baseActual}`;
        }
    };

    return (
        <ActividadLayout
            rutas={[{ label: TEXTOS.titulos.agrupacion, path: '/agrupacion', icon: 'icon-stack' }]}
            backPath="/"
            dificultad={dificultad}
            onChangeDificultad={(e) => generarNivel(parseInt(e.target.value))}
            onReiniciar={() => generarNivel(dificultad)}
            textoInfo={TEXTOS.infoActividades.agrupacion}
            mostrarFeedback={feedbackAbierto}
            esCorrecto={esRespuestaCorrecta}
            onCerrarFeedback={() => setFeedbackAbierto(false)}
        >
            <main className="agrupacion-layout-custom">
                {/* PANEL IZQUIERDO: La "Mesa" */}
                <section className="panel-mesa">
                    <div className="mesa-container">
                        <div className="mesa-zona-items">
                            {itemsMesa.map((item) => (
                                <button
                                    key={item.id}
                                    className={`objeto-agrupacion ${item.tipo} ${item.seleccionado ? 'seleccionado' : ''}`}
                                    onClick={() => toggleSeleccion(item.id)}
                                    aria-label={item.tipo === UNIDADES_NAME ? 'Unidad de palillo' : (item.tipo === DECENAS_NAME ? 'Decena de palillos' : 'Centena de palillos')}
                                    aria-pressed={item.seleccionado}
                                    title={item.tipo === UNIDADES_NAME ? 'Unidad de palillo' : (item.tipo === DECENAS_NAME ? 'Decena de palillos' : 'Centena de palillos')}
                                >
                                    <Icon name={getIconName(item.tipo)} />
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PANEL DERECHO: Controles y Respuesta */}
                <aside className="panel-controles-agrupacion">
                    {/* Botones de Accion */}
                    <div className="bloque-acciones">
                        <div className="fila-botones-atar">

                            {/* BOTON UNICO DE AGRUPAR */}
                            <button
                                className="icon-btn hover-primary btn-herramienta"
                                disabled={!canAgrupar}
                                onClick={ejecutarAgrupacion}
                                title="Agrupar"
                                aria-label="Agrupar palillos seleccionados"
                            >
                                <Icon name="icon-stack" />
                            </button>

                            {/* BOTON DE DESAGRUPAR */}
                            <button
                                className="icon-btn hover-primary btn-herramienta"
                                disabled={!canDesagrupar}
                                onClick={ejecutarDesagrupacion}
                                title="Desagrupar"
                                aria-label="Desagrupar palillos seleccionados"
                            >
                                <Icon name="icon-stack-off" />
                            </button>

                            {/* BOTON DE LIMPIAR SELECCION */}
                            <button
                                className="icon-btn hover-danger btn-herramienta"
                                onClick={limpiarSeleccion}
                                title="Quitar Selección"
                                aria-label="Quitar selección de palillos"
                            >
                                <Icon name="icon-erase" />
                            </button>

                        </div>
                    </div>

                    {/* Zona de Respuesta */}
                    <div className="bloque-respuesta">
                        <div className="unidad-referencia">
                            <Icon name="icon-palillo-unidad" />
                        </div>
                        <div className="pickers-grid">
                            {dificultad >= 1 && <SwipePicker opciones={MiNumero.losDigitos} value={idxCentenas} onChange={setidxCentenas} />}
                            <SwipePicker opciones={MiNumero.losDigitos} value={idxDecenas} onChange={setidxDecenas} />
                            <SwipePicker opciones={MiNumero.losDigitos} value={idxUnidades} onChange={setidxUnidades} />
                        </div>
                    </div>

                    <button className="btn-corregir-full hover-primary" onClick={validarEjercicio}>
                        {TEXTOS.global.corregir}
                    </button>
                </aside>
            </main>
        </ActividadLayout>
    );
}