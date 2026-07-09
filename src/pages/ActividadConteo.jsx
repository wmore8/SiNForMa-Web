import { useState } from 'react';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { Icon } from '../shared/components/Icon';
import { MiNumero } from '../shared/utils/MiNumero';
import { TEXTOS } from '../constants/textos';
import "../styles/ActividadConteo.css"

const crearNivelAleatorio = (nivelDificultad, base) => {
    let maxObjetivo = 0;
    if (nivelDificultad === 0) maxObjetivo = base - 1;
    else if (nivelDificultad === 1) maxObjetivo = Math.pow(base, 2) - 1;
    else maxObjetivo = Math.pow(base, 3) - 1;

    const objIzq = Math.floor(Math.random() * maxObjetivo) + 1;
    const objDer = Math.floor(Math.random() * maxObjetivo) + 1;
    const sumaTotal = objIzq + objDer;

    let configAlmacen = { centenas: 0, decenas: 0, unidades: 0 };
    if (nivelDificultad === 0) {
        configAlmacen.unidades = sumaTotal + 3;
    } else if (nivelDificultad === 1) {
        configAlmacen.decenas = Math.floor(sumaTotal / base) + 2;
        configAlmacen.unidades = 2;
    } else {
        configAlmacen.centenas = Math.floor(sumaTotal / (base * base)) + 2;
        configAlmacen.decenas = 0;
        configAlmacen.unidades = 2;
    }

    return { objetivos: { izq: objIzq, der: objDer }, almacen: configAlmacen };
};

export function ActividadConteo() {
    const base = MiNumero.baseActual;
    const [dificultad, setDificultad] = useState(0);
    const [cajaActiva, setCajaActiva] = useState('izq');
    // Lazy initialization solo se realiza una unica vez al recargar la pagina
    const [configInicial] = useState(() => crearNivelAleatorio(0, base));

    const [objetivos, setObjetivos] = useState(configInicial.objetivos);
    const [almacen, setAlmacen] = useState(configInicial.almacen);

    const [cajaIzq, setCajaIzq] = useState({ centenas: 0, decenas: 0, unidades: 0 });
    const [cajaDer, setCajaDer] = useState({ centenas: 0, decenas: 0, unidades: 0 });

    const [feedbackAbierto, setFeedbackAbierto] = useState(false);
    const [esRespuestaCorrecta, setEsRespuestaCorrecta] = useState(false);

    // Estado para errores de validacion
    const [errores, setErrores] = useState({ izq: false, der: false });
    const [aciertos, setAciertos] = useState({ izq: false, der: false });

    // Cuando el usuario le da a reiniciar o cambia la dificultad
    const generarEjercicio = (nivelDificultad) => {
        const nuevaConfig = crearNivelAleatorio(nivelDificultad, base);

        setDificultad(nivelDificultad);
        setObjetivos(nuevaConfig.objetivos);
        setAlmacen(nuevaConfig.almacen);
        setCajaIzq({ centenas: 0, decenas: 0, unidades: 0 });
        setCajaDer({ centenas: 0, decenas: 0, unidades: 0 });
        setFeedbackAbierto(false);
        setErrores({ izq: false, der: false });
        setAciertos({ izq: false, der: false });
    };

    const getValorTotal = (estado) => (estado.centenas * base * base) + (estado.decenas * base) + estado.unidades;

    const autoCompactar = (estado) => {
        let { centenas, decenas, unidades } = estado;
        if (unidades >= base) {
            decenas += Math.floor(unidades / base);
            unidades = unidades % base;
        }
        if (decenas >= base) {
            centenas += Math.floor(decenas / base);
            decenas = decenas % base;
        }
        return { centenas, decenas, unidades };
    };

    // Limitamos el numero de objetos en el contenedor
    const maxPermitido = dificultad === 0 ? base - 1 : (dificultad === 1 ? Math.pow(base, 2) - 1 : Math.pow(base, 3) - 1);

    // Funciones de interaccion limpian los errores visuales
    const limpiarErrores = () => setErrores({ izq: false, der: false });
    const limpiarAciertos = () => setAciertos({ izq: false, der: false });


    const moverAActiva = (tipo) => {
        const cajaActual = cajaActiva === 'izq' ? cajaIzq : cajaDer;
        const valorAAgregar = tipo === 'unidades' ? 1 : (tipo === 'decenas' ? base : base * base);

        if (getValorTotal(cajaActual) + valorAAgregar > maxPermitido) return;

        if (almacen[tipo] > 0) {
            setAlmacen(prev => ({ ...prev, [tipo]: prev[tipo] - 1 }));
            if (cajaActiva === 'izq') setCajaIzq(prev => autoCompactar({ ...prev, [tipo]: prev[tipo] + 1 }));
            else setCajaDer(prev => autoCompactar({ ...prev, [tipo]: prev[tipo] + 1 }));
            limpiarErrores();
            limpiarAciertos();
        }
    };

    const devolverAlmacen = (lado, tipo, e) => {
        e.stopPropagation();
        const setCaja = lado === 'izq' ? setCajaIzq : setCajaDer;
        const cajaTarget = lado === 'izq' ? cajaIzq : cajaDer;

        if (cajaTarget[tipo] > 0) {
            setCaja(prev => ({ ...prev, [tipo]: prev[tipo] - 1 }));
            setAlmacen(prev => ({ ...prev, [tipo]: prev[tipo] + 1 }));
            limpiarErrores();
            limpiarAciertos();
        }
    };

    const vaciarCaja = (lado, e) => {
        e.stopPropagation();
        const caja = lado === 'izq' ? cajaIzq : cajaDer;
        setAlmacen(prev => ({
            centenas: prev.centenas + caja.centenas,
            decenas: prev.decenas + caja.decenas,
            unidades: prev.unidades + caja.unidades
        }));
        if (lado === 'izq') setCajaIzq({ centenas: 0, decenas: 0, unidades: 0 });
        else setCajaDer({ centenas: 0, decenas: 0, unidades: 0 });
        limpiarErrores();
        limpiarAciertos();
    };

    const desarmar = (tipo) => {
        if (tipo === 'centenas' && almacen.centenas > 0) {
            setAlmacen(prev => ({ ...prev, centenas: prev.centenas - 1, decenas: prev.decenas + base }));
        }
        if (tipo === 'decenas' && almacen.decenas > 0) {
            setAlmacen(prev => ({ ...prev, decenas: prev.decenas - 1, unidades: prev.unidades + base }));
        }
        limpiarErrores();
        limpiarAciertos();
    };

    const validarEjercicio = () => {
        const izqOk = getValorTotal(cajaIzq) === objetivos.izq;
        const derOk = getValorTotal(cajaDer) === objetivos.der;

        if (izqOk && derOk) {
            setEsRespuestaCorrecta(true);
            setFeedbackAbierto(true);
            setErrores({ izq: false, der: false });
            setAciertos({ izq: izqOk, der: derOk });
        } else {
            setEsRespuestaCorrecta(false);
            setFeedbackAbierto(true);
            setErrores({ izq: !izqOk, der: !derOk });
            setAciertos({ izq: izqOk, der: derOk });
        }
    };

    const renderObjetos = (cantidad, tipo, iconName, onClickFn) => {
        const labelMap = {
            'palillo-unidad': 'Unidad de palillo',
            'palillo-decena': 'Grupo de palillos decena u octeto',
            'palillo-centena': 'Caja de palillos centena'
        };
        const label = labelMap[tipo] || tipo;

        return Array.from({ length: cantidad }).map((_, i) => (
            <button
                key={`${tipo}-${i}`}
                className={`objeto-conteo ${tipo}`}
                onClick={onClickFn}
                aria-label={`${label} número ${i + 1}`}
            >
                <Icon name={iconName} />
            </button>
        ));
    };

    // Manejador de teclado para seleccionar contenedor
    const handleCajaInteraccion = (lado, e) => {
        // Si es click de raton o tecla Enter/Espacio
        if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setCajaActiva(lado);
        }
    };

    return (
        <ActividadLayout
            rutas={[{ label: TEXTOS.titulos.conteo, path: '/conteo' }]}
            backPath="/"
            dificultad={dificultad}
            onChangeDificultad={(e) => generarEjercicio(parseInt(e.target.value))}
            onReiniciar={() => generarEjercicio(dificultad)}
            textoInfo={TEXTOS.infoActividades.conteo}
            mostrarFeedback={feedbackAbierto}
            esCorrecto={esRespuestaCorrecta}
            onCerrarFeedback={() => setFeedbackAbierto(false)}
            mensajeExito={TEXTOS.feedback.exitoConteo}
            mensajeError={TEXTOS.feedback.errorConteo}
        >
            <div className="conteo-main-wrapper">
                {/* ZONA SUPERIOR: CAJAS OBJETIVO */}
                <div className="conteo-cajas-container">

                    <div className="caja-wrapper">
                        <div className="caja-header-externo">
                            <h2>{new MiNumero(objetivos.izq, 10).toString()}</h2>
                            <button className="icon-btn hover-danger" title="Quitar palillos" aria-label="Vaciar contenedor izquierdo" onClick={(e) => vaciarCaja('izq', e)}><Icon name="icon-erase" /></button>
                        </div>
                        <div
                            className={`conteo-caja ${cajaActiva === 'izq' ? 'activa' : ''} ${errores.izq ? 'erronea' : ''} ${aciertos.izq ? 'correcta' : ''} `}
                            role="button"
                            tabIndex="0"
                            aria-pressed={cajaActiva === 'izq'}
                            onClick={(e) => handleCajaInteraccion('izq', e)}
                            onKeyDown={(e) => handleCajaInteraccion('izq', e)}
                        >
                            <div className="caja-zona-items">
                                {renderObjetos(cajaIzq.centenas, 'palillo-centena', base === 8 ? 'icon-palillo-centena-romescus' : 'icon-palillo-centena-decimal' , (e) => devolverAlmacen('izq', 'centenas', e))}
                                {renderObjetos(cajaIzq.decenas, 'palillo-decena', base === 8 ? 'icon-palillo-decena-romescus' : 'icon-palillo-decena-decimal', (e) => devolverAlmacen('izq', 'decenas', e))}
                                {renderObjetos(cajaIzq.unidades, 'palillo-unidad', 'icon-palillo-unidad', (e) => devolverAlmacen('izq', 'unidades', e))}
                            </div>
                        </div>
                    </div>

                    <div className="caja-wrapper">
                        <div className="caja-header-externo">
                            <h2>{new MiNumero(objetivos.der, 10).toString()}</h2>
                            <button className="icon-btn hover-danger" title="Quitar palillos" aria-label="Vaciar contenedor derecho" onClick={(e) => vaciarCaja('der', e)}><Icon name="icon-erase" /></button>
                        </div>
                        <div
                            className={`conteo-caja ${cajaActiva === 'der' ? 'activa' : ''} ${errores.der ? 'erronea' : ''} ${aciertos.der ? 'correcta' : ''}`}
                            role="button"
                            tabIndex="0"
                            aria-pressed={cajaActiva === 'der'}
                            onClick={(e) => handleCajaInteraccion('der', e)}
                            onKeyDown={(e) => handleCajaInteraccion('der', e)}
                        >
                            <div className="caja-zona-items">
                                {renderObjetos(cajaDer.centenas, 'palillo-centena', base === 8 ? 'icon-palillo-centena-romescus' : 'icon-palillo-centena-decimal', (e) => devolverAlmacen('der', 'centenas', e))}
                                {renderObjetos(cajaDer.decenas, 'palillo-decena', base === 8 ? 'icon-palillo-decena-romescus' : 'icon-palillo-decena-decimal', (e) => devolverAlmacen('der', 'decenas', e))}
                                {renderObjetos(cajaDer.unidades, 'palillo-unidad', 'icon-palillo-unidad', (e) => devolverAlmacen('der', 'unidades', e))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ZONA INFERIOR: ALMACEN Y VALIDACION */}
                <div className="zona-inferior">
                    <div className="conteo-almacen">
                        <div className={`almacen-paneles dificultad-${dificultad}`}>
                            {dificultad === 2 && (
                                <div className="almacen-seccion-wrapper">
                                    <div className="almacen-seccion-header-externo">
                                        <Icon name={base === 8 ? 'icon-palillo-centena-romescus' : 'icon-palillo-centena-decimal'} />
                                        <button className="icon-btn hover-primary" title='Dividir Caja' aria-label="Dividir caja de centenas en decenas" disabled={almacen.centenas === 0} onClick={() => desarmar('centenas')}><Icon name="icon-split" /></button>
                                    </div>
                                    <div className="almacen-items">{renderObjetos(almacen.centenas, 'palillo-centena', base === 8 ? 'icon-palillo-centena-romescus' : 'icon-palillo-centena-decimal', () => moverAActiva('centenas'))}</div>
                                </div>
                            )}

                            {(dificultad >= 1) && (
                                <div className="almacen-seccion-wrapper">
                                    <div className="almacen-seccion-header-externo">
                                        <Icon name={base === 8 ? 'icon-palillo-decena-romescus' : 'icon-palillo-decena-decimal'} />
                                        <button className="icon-btn hover-primary" title='Dividir Estuche' aria-label="Dividir estuche de decenas en unidades" disabled={almacen.decenas === 0} onClick={() => desarmar('decenas')}><Icon name="icon-split" /></button>
                                    </div>
                                    <div className="almacen-items">{renderObjetos(almacen.decenas, 'palillo-decena', base === 8 ? 'icon-palillo-decena-romescus' : 'icon-palillo-decena-decimal', () => moverAActiva('decenas'))}</div>
                                </div>
                            )}

                            <div className="almacen-seccion-wrapper">
                                <div className="almacen-seccion-header-externo">
                                    <Icon name="icon-palillo-unidad" />
                                    {/* Mantiene la simetria visual y de altura */}
                                    <div className="icon-btn" style={{ visibility: 'hidden' }} aria-hidden="true"><Icon name="icon-split" /></div>
                                </div>
                                <div className="almacen-items">{renderObjetos(almacen.unidades, 'palillo-unidad', 'icon-palillo-unidad', () => moverAActiva('unidades'))}</div>
                            </div>
                        </div>
                    </div>

                    <button className="btn-corregir-full hover-primary" onClick={validarEjercicio}>{TEXTOS.global.corregir}</button>
                </div>
            </div>
        </ActividadLayout>
    );
}