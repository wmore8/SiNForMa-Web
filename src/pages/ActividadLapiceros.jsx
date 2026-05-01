import { useState } from 'react';
import { Icon } from '../shared/components/Icon';
import { MiNumero } from '../shared/utils/MiNumero';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { MyNumberPicker } from '../shared/components/MyNumberPicker';
import { TEXTOS } from '../constants/textos';
import '../styles/ActividadLapiceros.css';

export function ActividadLapiceros() {
    const [dificultad, setDificultad] = useState('0');

    const getBase = () => MiNumero.baseActual;
    const getMaxLapices = () => Math.pow(getBase(), 3);

    // Lazy initialization: Calculamos los valores aleatorios desde el principio
    const [objetivo, setObjetivo] = useState(() => Math.floor(Math.random() * (getMaxLapices() + 1)));
    // posibilidad de desactivar las UNIDADES en un 50%
    const [unidadesHabilitadas, setUnidadesHabilitadas] = useState(() => Math.random() < 0.5);
    // Inicializamos los valores de los inputs
    const [cajas, setCajas] = useState(0);
    const [estuches, setEstuches] = useState(0);
    const [lapices, setLapices] = useState(0);
    //Estados para los modales
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);

    const generarEjercicio = () => {
        setObjetivo(Math.floor(Math.random() * (getMaxLapices() + 1)));
        setUnidadesHabilitadas(Math.random() < 0.5);
        // Reiniciamos los valores de los inputs
        setCajas(0);
        setEstuches(0);
        setLapices(0);
    };

    // Handler del evento
    const cambiarDificultad = (e) => {
        setDificultad(e.target.value);
        generarEjercicio();
    };


    const addCaja = () => setCajas(prev => prev < getBase() ? prev + 1 : prev);
    const delCaja = () => setCajas(prev => prev > 0 ? prev - 1 : prev);

    const addEstuche = () => setEstuches(prev => prev < Math.pow(getBase(), 2) ? prev + 1 : prev);
    const delEstuche = () => setEstuches(prev => prev > 0 ? prev - 1 : prev);

    const addLapiz = () => setLapices(prev => prev < getMaxLapices() ? prev + 1 : prev);
    const delLapiz = () => setLapices(prev => prev > 0 ? prev - 1 : prev);

    const validarEjercicio = () => {
        const base = getBase();
        const total = lapices + (estuches * base) + (cajas * Math.pow(base, 2));
        const dif = total - objetivo;
        const acierto = (unidadesHabilitadas && dif === 0) || (!unidadesHabilitadas && dif >= 0 && dif <= base - 1);

        setEsCorrecto(acierto);
        setMostrarFeedback(true);
    };

    const aRomesco = (numDecimal) => new MiNumero(numDecimal, 10).toString();

    // Funcion que renderiza Icono O Texto dependiendo de la dificultad
    const renderInfo = (tipo, texto) => {
        if (dificultad === '2') { // En Dificil SOLO mostramos el texto
            return <span className="lapicero-texto">{texto}</span>;
        }

        let nombreIcono = 'icon-default';
        if (dificultad === '0') { // En Facil o Medio SOLO mostramos el icono
            if (tipo === 'lapiz') nombreIcono = 'icon-lapiz-sm';
            if (tipo === 'estuche') nombreIcono = 'icon-lapiz-estuche';
            if (tipo === 'caja') nombreIcono = 'icon-lapiz-caja';
        } else if (dificultad === '1') {
            if (tipo === 'lapiz') nombreIcono = 'icon-cuadrado';
            if (tipo === 'estuche') nombreIcono = 'icon-cuadrado-estuche';
            if (tipo === 'caja') nombreIcono = 'icon-cuadrado-caja';
        }

        return <Icon name={nombreIcono} className="lapicero-icono" />;
    };

    return (
        <ActividadLayout
            rutas={[{ label: TEXTOS.titulos.lapiceros, icon: 'icon-lapiz' }]}
            backPath="/"
            dificultad={dificultad}
            onChangeDificultad={cambiarDificultad}
            onReiniciar={generarEjercicio}
            textoInfo={TEXTOS.infoActividades.lapiceros}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={() => setMostrarFeedback(false)}
            mensajeExito={TEXTOS.feedback.exitoLapiceros}
            mensajeError={TEXTOS.feedback.errorLapiceros}
        >
            <div className="actividad-zona-juego">
                <div className="objetivo-container">
                    <div className="objetivo-numero">
                        {aRomesco(objetivo)} <span className='texto-lapiceros'>{TEXTOS.ui.lapiceros.objetivo}</span>
                    </div>
                </div>

                <div className="lapiceros-lista">
                    {/* UNIDADES: Lapiz*/}
                    <div className={`lapicero-item ${!unidadesHabilitadas ? 'deshabilitado' : ''}`}>
                        <div className="lapicero-info">
                            {renderInfo('lapiz', TEXTOS.ui.lapiceros.lapiz)}
                        </div>
                        <div className="lapicero-controles">
                            <MyNumberPicker
                                valorMostrado={aRomesco(lapices)}
                                onSubir={addLapiz}
                                onBajar={delLapiz}
                                disableSubir={!unidadesHabilitadas || lapices >= getMaxLapices()}
                                disableBajar={!unidadesHabilitadas || lapices <= 0}
                            />
                        </div>
                    </div>

                    {/* DECENAS: Estuche */}
                    <div className="lapicero-item">
                        <div className="lapicero-info">
                            {renderInfo('estuche', TEXTOS.ui.lapiceros.estuche)}
                        </div>
                        <div className="lapicero-controles">
                            <MyNumberPicker
                                valorMostrado={aRomesco(estuches)}
                                onSubir={addEstuche}
                                onBajar={delEstuche}
                                disableSubir={estuches >= Math.pow(getBase(), 2)}
                                disableBajar={estuches <= 0}
                            />
                        </div>
                    </div>

                    {/* CENTENAS: Caja */}
                    <div className="lapicero-item">
                        <div className="lapicero-info">
                            {renderInfo('caja', TEXTOS.ui.lapiceros.caja)}
                        </div>
                        <div className="lapicero-controles">
                            <MyNumberPicker
                                valorMostrado={aRomesco(cajas)}
                                onSubir={addCaja}
                                onBajar={delCaja}
                                disableSubir={cajas >= getBase()}
                                disableBajar={cajas <= 0}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="actividad-footer">
                <button className="btn-corregir-full" onClick={validarEjercicio}>
                    {TEXTOS.global.corregir}
                </button>
            </div>

        </ActividadLayout>
    );
}