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

    let configAlmacen = { cajas: 0, estuches: 0, lapices: 0 };
    if (nivelDificultad === 0) {
        configAlmacen.lapices = sumaTotal + 3;
    } else if (nivelDificultad === 1) {
        configAlmacen.estuches = Math.floor(sumaTotal / base) + 2;
        configAlmacen.lapices = 2;
    } else {
        configAlmacen.cajas = Math.floor(sumaTotal / (base * base)) + 2;
        configAlmacen.estuches = 0;
        configAlmacen.lapices = 2;
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

    const [cajaIzq, setCajaIzq] = useState({ cajas: 0, estuches: 0, lapices: 0 });
    const [cajaDer, setCajaDer] = useState({ cajas: 0, estuches: 0, lapices: 0 });

    const [feedbackAbierto, setFeedbackAbierto] = useState(false);
    const [esRespuestaCorrecta, setEsRespuestaCorrecta] = useState(false);

    // Estado para errores de falidacion
    const [errores, setErrores] = useState({ izq: false, der: false });
    const [aciertos, setAciertos] = useState({ izq: false, der: false });

    // Cuando el usuario le da a reiniciar o cambia la dificultad
    const generarEjercicio = (nivelDificultad) => {
        const nuevaConfig = crearNivelAleatorio(nivelDificultad, base);

        setDificultad(nivelDificultad);
        setObjetivos(nuevaConfig.objetivos);
        setAlmacen(nuevaConfig.almacen);
        setCajaIzq({ cajas: 0, estuches: 0, lapices: 0 });
        setCajaDer({ cajas: 0, estuches: 0, lapices: 0 });
        setFeedbackAbierto(false);
        setErrores({ izq: false, der: false });
        setAciertos({ izq: false, der: false });
    };

    const getValorTotal = (estado) => (estado.cajas * base * base) + (estado.estuches * base) + estado.lapices;

    const autoCompactar = (estado) => {
        let { cajas, estuches, lapices } = estado;
        if (lapices >= base) {
            estuches += Math.floor(lapices / base);
            lapices = lapices % base;
        }
        if (estuches >= base) {
            cajas += Math.floor(estuches / base);
            estuches = estuches % base;
        }
        return { cajas, estuches, lapices };
    };

    // Limitamos el numero de objetos en el contenedor
    const maxPermitido = dificultad === 0 ? base - 1 : (dificultad === 1 ? Math.pow(base, 2) - 1 : Math.pow(base, 3) - 1);

    // Funciones de interaccion limpian los errores visuales
    const limpiarErrores = () => setErrores({ izq: false, der: false });
    const limpiarAciertos = () => setAciertos({ izq: false, der: false });


    const moverAActiva = (tipo) => {
        const cajaActual = cajaActiva === 'izq' ? cajaIzq : cajaDer;
        const valorAAgregar = tipo === 'lapices' ? 1 : (tipo === 'estuches' ? base : base * base);

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
            cajas: prev.cajas + caja.cajas,
            estuches: prev.estuches + caja.estuches,
            lapices: prev.lapices + caja.lapices
        }));
        if (lado === 'izq') setCajaIzq({ cajas: 0, estuches: 0, lapices: 0 });
        else setCajaDer({ cajas: 0, estuches: 0, lapices: 0 });
        limpiarErrores();
        limpiarAciertos();
    };

    const desarmar = (tipo) => {
        if (tipo === 'caja' && almacen.cajas > 0) {
            setAlmacen(prev => ({ ...prev, cajas: prev.cajas - 1, estuches: prev.estuches + base }));
        }
        if (tipo === 'estuche' && almacen.estuches > 0) {
            setAlmacen(prev => ({ ...prev, estuches: prev.estuches - 1, lapices: prev.lapices + base }));
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
        return Array.from({ length: cantidad }).map((_, i) => (
            <button key={`${tipo}-${i}`} className={`objeto-conteo ${tipo}`} onClick={onClickFn}>
                <Icon name={iconName} />
            </button>
        ));
    };

    // Manejador de teclado para seleccionar contenerdor
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
                            <h3>{new MiNumero(objetivos.izq, 10).toString()}</h3>
                            <button className="icon-btn hover-danger" title="Quitar palillos" onClick={(e) => vaciarCaja('izq', e)}><Icon name="icon-erase" /></button>
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
                                {renderObjetos(cajaIzq.cajas, 'caja', base === 8 ? 'icon-caja-facil-romescus' : 'icon-caja-facil-decimal' , (e) => devolverAlmacen('izq', 'cajas', e))}
                                {renderObjetos(cajaIzq.estuches, 'estuche', base === 8 ? 'icon-estuche-facil-romescus' : 'icon-estuche-facil-decimal', (e) => devolverAlmacen('izq', 'estuches', e))}
                                {renderObjetos(cajaIzq.lapices, 'lapiz', 'icon-lapiz-sm', (e) => devolverAlmacen('izq', 'lapices', e))}
                            </div>
                        </div>
                    </div>

                    <div className="caja-wrapper">
                        <div className="caja-header-externo">
                            <h3>{new MiNumero(objetivos.der, 10).toString()}</h3>
                            <button className="icon-btn hover-danger" title="Quitar palillos" onClick={(e) => vaciarCaja('der', e)}><Icon name="icon-erase" /></button>
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
                                {renderObjetos(cajaDer.cajas, 'caja', base === 8 ? 'icon-caja-facil-romescus' : 'icon-caja-facil-decimal', (e) => devolverAlmacen('der', 'cajas', e))}
                                {renderObjetos(cajaDer.estuches, 'estuche', base === 8 ? 'icon-estuche-facil-romescus' : 'icon-estuche-facil-decimal', (e) => devolverAlmacen('der', 'estuches', e))}
                                {renderObjetos(cajaDer.lapices, 'lapiz', 'icon-lapiz-sm', (e) => devolverAlmacen('der', 'lapices', e))}
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
                                        <Icon name="icon-lapiz-caja" />
                                        <button className="icon-btn hover-primary" title='Dividir Caja' disabled={almacen.cajas === 0} onClick={() => desarmar('caja')}><Icon name="icon-split" /></button>
                                    </div>
                                    <div className="almacen-items">{renderObjetos(almacen.cajas, 'caja', base === 8 ? 'icon-caja-facil-romescus' : 'icon-caja-facil-decimal', () => moverAActiva('cajas'))}</div>
                                </div>
                            )}

                            {(dificultad >= 1) && (
                                <div className="almacen-seccion-wrapper">
                                    <div className="almacen-seccion-header-externo">
                                        <Icon name="icon-lapiz-estuche" />
                                        <button className="icon-btn hover-primary" title='Dividir Estuche' disabled={almacen.estuches === 0} onClick={() => desarmar('estuche')}><Icon name="icon-split" /></button>
                                    </div>
                                    <div className="almacen-items">{renderObjetos(almacen.estuches, 'estuche', base === 8 ? 'icon-estuche-facil-romescus' : 'icon-estuche-facil-decimal', () => moverAActiva('estuches'))}</div>
                                </div>
                            )}

                            <div className="almacen-seccion-wrapper">
                                <div className="almacen-seccion-header-externo">
                                    <Icon name="icon-lapiz" />
                                    {/* Mantiene la simetria visual y de altura */}
                                    <button className="icon-btn" style={{ visibility: 'hidden' }} disabled><Icon name="icon-split" /></button>
                                </div>
                                <div className="almacen-items">{renderObjetos(almacen.lapices, 'lapiz', 'icon-lapiz-sm', () => moverAActiva('lapices'))}</div>
                            </div>
                        </div>
                    </div>

                    <button className="btn-corregir-full hover-primary" onClick={validarEjercicio}>{TEXTOS.global.corregir}</button>
                </div>
            </div>
        </ActividadLayout>
    );
}