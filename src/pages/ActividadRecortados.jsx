import { useState } from 'react';
import { TecladoBase8 } from '../shared/components/TecladoBase8';
import { MiNumero } from '../shared/utils/MiNumero';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { TEXTOS } from '../constants/textos';
import { useNavegacionFlechas } from '../shared/hooks/useNavegacionFlechas';
import { useAutoFocoInicial } from '../shared/hooks/useAutoFocoInicial';
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

            solTotal: (val1 * val2).toString(8) // Total Final
        }
    };
};

export function ActividadRecortados() {
    const [ejercicio, setEjercicio] = useState(() => generarRecortados());

    const celdasVacias = { s13: '', s12: '', s11: '', s1: '', s23: '', s22: '', s21: '', s2: '', solTotal: '' };
    const [celdas, setCeldas] = useState(celdasVacias);
    const [feedback, setFeedback] = useState(celdasVacias);

    const [celdaActiva, setCeldaActiva] = useState(null);

    // map con las posiciones de navegacion de accesibilidad
    const navegacionGrid = [
        ['solTotal', 'solTotal', 'solTotal', 'solTotal'],
        ['s23', 's22', 's21', 's2'],
        ['s13', 's12', 's11', 's1'],
        ['btn-corregir', 'btn-corregir', 'btn-corregir', 'btn-corregir']
    ];

    const handleFlechas = useNavegacionFlechas(navegacionGrid, setCeldaActiva);

    // Auto-focus al Total nada mas entrar
    useAutoFocoInicial(ejercicio, 'celda-solTotal', setCeldaActiva);

    // Estados para los modales
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);

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
                id={`celda-${id}`}
                tabIndex={0}
                key={id}
                className={`celda-ancha ${estaLlena} ${isActive ? 'activa' : ''} ${feed}`}
                onClick={() => setCeldaActiva(id)}
                onFocus={() => setCeldaActiva(id)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCeldaActiva(id);
                    } else {
                        // Le pasamos el evento y el ID actual a nuestro hook genérico
                        handleFlechas(e, id);
                    }
                }}
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

    const valTotal = celdas['solTotal'];
    const actTotal = celdaActiva === 'solTotal';
    const feedTotal = feedback['solTotal'];
    const llenaTotal = (valTotal !== '' && feedTotal === '') ? 'llena' : '';

    return (

        <ActividadLayout
            rutas={[
                { label: TEXTOS.titulos.operaciones, path: '/operaciones' },
                { label: TEXTOS.titulos.multiplicaciones, path: '/operaciones/multiplicaciones' },
                { label: TEXTOS.titulos.recortados }
            ]}
            backPath="/operaciones/multiplicaciones"
            dificultad={0}
            opcionesDificultad={[{ id: 0, label: "Nivel Único" }]}
            onChangeDificultad={() => { }}
            onReiniciar={reiniciarTodo}
            textoInfo={TEXTOS.infoActividades.recortados}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={() => setMostrarFeedback(false)}
            mensajeExito={TEXTOS.feedback.exitoRecortados}
            mensajeError={TEXTOS.feedback.errorRecortados}
            className="multiplicacion-layout-custom modo-dificil"
        >
            <main className="actividad-zona-juego">
                <div className='panel-izquierdo'>
                    <div className="operacion-original">
                        <span>
                            {aSimbolo(ejercicio.str1Original)} <span className="signo-primario">×</span> {aSimbolo(ejercicio.str2Original)}
                        </span>
                        <div className="etiqueta-recortado signo-primario">=</div>
                        <div
                            id="celda-solTotal"
                            className={`caja-total ${llenaTotal} ${actTotal ? 'activa' : ''} ${feedTotal}`}
                            onClick={() => setCeldaActiva('solTotal')}
                            onFocus={() => setCeldaActiva('solTotal')}
                            tabIndex={0} 
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

                    <div className="container-recortados">
                        <div className="recortados-grid">

                            {/* ENCABEZADOS DE COLUMNA */}
                            <div className="etiqueta-recortado signo-primario">×</div> {/* Signo en la esquina superior izquierda */}
                            <div className="etiqueta-recortado con-borde">{aSimbolo(ejercicio.lbl1C)}</div>
                            <div className="etiqueta-recortado con-borde">{aSimbolo(ejercicio.lbl1D)}</div>
                            <div className="etiqueta-recortado con-borde">{aSimbolo(ejercicio.lbl1U)}</div>
                            <div></div> {/* Hueco del total vacio */}

                            <div className="linea-horizontal-grid"></div>

                            {/* FILA 1 (Multiplicado por las Decenas) */}
                            <div className="etiqueta-recortado con-borde">{aSimbolo(ejercicio.lbl2D)}</div>
                            {renderCelda('s23')}
                            {renderCelda('s22')}
                            {renderCelda('s21')}
                            {renderCelda('s2')} {/* Total Fila Decenas */}

                            {/* FILA 2 (Multiplicado por las Unidades) */}
                            <div className="etiqueta-recortado con-borde">{aSimbolo(ejercicio.lbl2U)}</div>
                            {renderCelda('s13')}
                            {renderCelda('s12')}
                            {renderCelda('s11')}
                            {renderCelda('s1')} {/* Total Fila Unidades */}

                            <div className="linea-horizontal-grid"></div>

                        </div>
                    </div>
                </div>

                <div className="panel-derecho-dificil">
                    <TecladoBase8 onTeclaClick={handleTeclaClick} deshabilitado={mostrarFeedback}/>
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