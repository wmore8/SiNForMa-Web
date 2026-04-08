// src/pages/ActividadLapiceros.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../shared/components/Icon';
import { MiNumero } from '../shared/utils/MiNumero';
import { Header } from '../shared/components/Header';
import '../styles/ActividadLapiceros.css';

export function ActividadLapiceros() {
    const [dificultad, setDificultad] = useState('0');

    // Lazy initialization: Calculamos los valores aleatorios desde el principio
    //simulacion de aleatoriedad de Java a JS -> R.nextInt(512) o Math.pow(8,3) (es 3 elevado a 8 : 3^8)
    const [objetivo, setObjetivo] = useState(() => Math.floor(Math.random() * 513));
    //posibilidad de desactivar las UNIDADES en un 50%
    const [unidadesHabilitadas, setUnidadesHabilitadas] = useState(() => Math.random() < 0.5);
    // Inicializamos los valores de los inputs
    const [cajas, setCajas] = useState(0);
    const [estuches, setEstuches] = useState(0);
    const [lapices, setLapices] = useState(0);

    const generarEjercicio = () => {
        // Simulacion de aleatoriedad de Java a JS -> R.nextInt(512) o Math.pow(8,3) (es 3 elevado a 8 : 3^8)
        setObjetivo(Math.floor(Math.random() * 513));
        // Posibilidad de desactivar las UNIDADES en un 50%
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


    const addCaja = () => setCajas(prev => prev < 8 ? prev + 1 : prev);
    const delCaja = () => setCajas(prev => prev > 0 ? prev - 1 : prev);

    const addEstuche = () => setEstuches(prev => prev < 64 ? prev + 1 : prev);
    const delEstuche = () => setEstuches(prev => prev > 0 ? prev - 1 : prev);

    const addLapiz = () => setLapices(prev => prev < 512 ? prev + 1 : prev);
    const delLapiz = () => setLapices(prev => prev > 0 ? prev - 1 : prev);

    const validarEjercicio = () => {
        const total = lapices + (estuches * 8) + (cajas * 64);
        const dif = total - objetivo;
        const esCorrecto = (unidadesHabilitadas && dif === 0) ||
            (!unidadesHabilitadas && dif >= 0 && dif <= 7);

        if (esCorrecto) alert("¡Perfecto! :D");
        else alert("Prueba otra vez :(");
    };

    const aRomesco = (numDecimal) => new MiNumero(numDecimal, 10).toString();

    // Funcion que renderiza Icono O Texto dependiendo de la dificultad
    const renderInfo = (tipo, texto) => {
        if (dificultad === '2') { // En Dificil SOLO mostramos el texto
            return <span className="lapicero-texto">{texto}</span>;
        }

        let nombreIcono = 'icon-default';
        if (dificultad === '0') { // En Facil o Medio SOLO mostramos el icono
            if (tipo === 'lapiz') nombreIcono = 'icon-lapiz';
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
        <div className="actividad-layout">

            <Header rutas={[{ label: 'Actividad Lapiceros', icon: 'icon-lapiz' }]} backPath="/" />

            <div className="actividad-controles">
                <button className="icon-btn btn-info" style={{ color: 'var(--text-color)' }} title='Información'>
                    <Icon name="icon-info" />
                </button>
                <select value={dificultad} className='dificultad-select' onChange={cambiarDificultad}>
                    <option value="0">Dificultad Fácil</option>
                    <option value="1">Dificultad Media</option>
                    <option value="2">Dificultad Difícil</option>
                </select>
                <button className="btn-secundario danger" onClick={generarEjercicio}>Reiniciar</button>
            </div>

            <div className="objetivo-container">
                <div className="objetivo-numero">{aRomesco(objetivo)} lapiceros</div>
            </div>

            <main className="lapiceros-zona-juego">
                <div className="lapiceros-lista">
                    {/* UNIDADES: Lapiz*/}
                    <div className={`lapicero-item ${!unidadesHabilitadas ? 'deshabilitado' : ''}`}>
                        <div className="lapicero-info">
                            {renderInfo('lapiz', 'Lápiz')}
                        </div>
                        <div className="lapicero-controles">
                            <div className="valor-box">{aRomesco(lapices)}</div>
                            <div className="botones-stack">
                                <button onClick={delLapiz} disabled={!unidadesHabilitadas}>−</button>
                                <button onClick={addLapiz} disabled={!unidadesHabilitadas}>+</button>
                            </div>
                        </div>
                    </div>

                    {/* DECENAS: Estuche */}
                    <div className="lapicero-item">
                        <div className="lapicero-info">
                            {renderInfo('estuche', 'Estuche')}
                        </div>
                        <div className="lapicero-controles">
                            <div className="valor-box">{aRomesco(estuches)}</div>
                            <div className="botones-stack">
                                <button onClick={delEstuche}>−</button>
                                <button onClick={addEstuche}>+</button>
                            </div>
                        </div>
                    </div>

                    {/* CENTENAS: Caja */}
                    <div className="lapicero-item">
                        <div className="lapicero-info">
                            {renderInfo('caja', 'Caja')}
                        </div>
                        <div className="lapicero-controles">
                            <div className="valor-box">{aRomesco(cajas)}</div>
                            <div className="botones-stack">
                                <button onClick={delCaja}>−</button>
                                <button onClick={addCaja}>+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="lapiceros-footer">
                <button className="btn-primario btn-corregir-full" onClick={validarEjercicio}>
                    Corregir
                </button>
            </footer>
        </div>
    );
}