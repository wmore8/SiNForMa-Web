import { useState, useMemo } from 'react';
import { Header } from '../shared/components/Header';
import { ActividadControles } from '../shared/components/ActividadControles';
import { TableroGrid } from '../shared/components/TableroGrid';
import { SwipePicker } from '../shared/components/SwipePicker';
import { MiNumero } from '../shared/utils/MiNumero';
import { ModalInfo } from '../shared/components/ModalInfo';
import { ModalFeedback } from '../shared/components/ModalFeedback';
import { useNavegacionFlechas } from '../shared/hooks/useNavegacionFlechas';
import { useControlDoblePicker } from '../shared/hooks/useControlDoblePicker';
import { TEXTOS } from '../constants/textos';
import '../styles/ActividadTablas.css';

// (Base + 1 por las cabeceras)
const MAX_BASE = MiNumero.baseActual + 1;
// Constantes de estado
const TIPO_CASILLA = { VISIBLE: 'visible', ADIVINABLE: 'guessable', CUBIERTA: 'covered', HEADER: 'header', ESQUINA: 'header esquina' };
const ESTADO_CASILLA = { BASE: 'idle', CORRECTO: 'correct', FALLO: 'error' };

// Arrays de opciones para los Pickers 
const DIGITOS = MiNumero.losDigitos;
const OPCIONES_UNIDADES = [...DIGITOS];
const OPCIONES_DECENAS = [' ', ...DIGITOS.slice(1)];

// Generador del tablero dinamico
const generarTableroMultiplicar = (nivel) => {
    let tablero = [];

    // Generamos el tablero base con todos los resultados
    for (let i = 0; i < MAX_BASE; i++) {
        let fila = [];
        for (let j = 0; j < MAX_BASE; j++) {
            let tipo = TIPO_CASILLA.VISIBLE;
            let texto = '';

            if (i === 0 && j === 0) {
                // Esquina superior izquierda
                tipo = TIPO_CASILLA.ESQUINA;
                texto = '×';
            } else if (i === 0) {
                // Cabecera horizontal (Multiplicador)
                tipo = TIPO_CASILLA.HEADER;
                texto = new MiNumero(j - 1, 10).toString();
            } else if (j === 0) {
                // Cabecera vertical (Multiplicando)
                tipo = TIPO_CASILLA.HEADER;
                texto = new MiNumero(i - 1, 10).toString();
            } else {
                // Celdas interiores (Producto de (i-1) * (j-1))
                const decimalResult = (i - 1) * (j - 1);
                texto = new MiNumero(decimalResult, 10).toString();
            }

            fila.push({
                id: `${i}-${j}`,
                i, j,
                realText: texto,
                currentText: texto,
                type: tipo,
                status: ESTADO_CASILLA.BASE
            });
        }
        tablero.push(fila);
    }

    // Aplicamos la logica de ocultar celdas segun la dificultad
    if (nivel === '0') {
        // Facil: Oculta 1 columna entera
        const colAleatoria = Math.floor(Math.random() * (MAX_BASE - 1)) + 1;
        for (let i = 1; i < MAX_BASE; i++) {
            tablero[i][colAleatoria].type = TIPO_CASILLA.ADIVINABLE;
            tablero[i][colAleatoria].currentText = '?';
        }
    } else if (nivel === '1') {
        // Medio: Oculta un 20% de las celdas interiores aleatoriamente
        for (let i = 1; i < MAX_BASE; i++) {
            for (let j = 1; j < MAX_BASE; j++) {
                if (Math.random() < 0.20) {
                    tablero[i][j].type = TIPO_CASILLA.ADIVINABLE;
                    tablero[i][j].currentText = '?';
                }
            }
        }
    } else if (nivel === '2') {
        // Dificil: Oculta TODAS las celdas interiores y pide adivinar 7 aleatorias
        for (let i = 1; i < MAX_BASE; i++) {
            for (let j = 1; j < MAX_BASE; j++) {
                tablero[i][j].type = TIPO_CASILLA.CUBIERTA;
                tablero[i][j].currentText = ''; // Se veran tapadas
            }
        }
        let puestas = 0;
        while (puestas < 7) {
            let r = Math.floor(Math.random() * (MAX_BASE - 1)) + 1;
            let c = Math.floor(Math.random() * (MAX_BASE - 1)) + 1;
            if (tablero[r][c].type !== TIPO_CASILLA.ADIVINABLE) {
                tablero[r][c].type = TIPO_CASILLA.ADIVINABLE;
                tablero[r][c].currentText = '?';
                puestas++;
            }
        }
    }

    return tablero.flat();
};

export function ActividadTablasMultiplicar() {
    const [dificultad, setDificultad] = useState('0');
    const [grid, setGrid] = useState(() => generarTableroMultiplicar('0'));

    const [idxDecenas, setIdxDecenas] = useState(0);
    const [idxUnidades, setIdxUnidades] = useState(0);

    // ESTADOS PARA MODALES MANUALES
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);
    const [mensajeFeedback, setMensajeFeedback] = useState("");

    const navegacionGrid = useMemo(() => {
        let nGrid = [];

        for (let i = 0; i < MAX_BASE; i++) {
            let fila = [];
            for (let j = 0; j < MAX_BASE; j++) {
                const c = grid[i * MAX_BASE + j];
                if (c && c.type === TIPO_CASILLA.ADIVINABLE) {
                    fila.push(c.id);
                } else {
                    fila.push(null);
                }
            }
            nGrid.push(fila);
        }
        nGrid.push(Array(MAX_BASE).fill('btn-corregir'));
        return nGrid;
    }, [grid]);

    const handleFlechas = useNavegacionFlechas(navegacionGrid, null, mostrarFeedback || mostrarInfo);
    const handleKeyDownGrid = useControlDoblePicker(idxDecenas, setIdxDecenas, idxUnidades, setIdxUnidades, handleFlechas);

    const cambiarDificultad = (e) => {
        const nuevoNivel = e.target.value;
        setDificultad(nuevoNivel);
        setGrid(generarTableroMultiplicar(nuevoNivel));
        setIdxDecenas(0);
        setIdxUnidades(0);
    };

    const reiniciarJuego = () => {
        setGrid(generarTableroMultiplicar(dificultad));
        setIdxDecenas(0);
        setIdxUnidades(0);
    };

    const handleCellClick = (casilla) => {
        if (casilla.type === TIPO_CASILLA.ADIVINABLE) {
            setGrid(grid.map(c => {
                if (c.id === casilla.id) {
                    const charDecena = OPCIONES_DECENAS[idxDecenas].trim();
                    const charUnidad = OPCIONES_UNIDADES[idxUnidades].trim();
                    // Juntamos y limpiamos espacios si no hay decenas
                    const textoSpinner = `${charDecena}${charUnidad}`;
                    return { ...c, currentText: textoSpinner, status: ESTADO_CASILLA.BASE };
                }
                return c;
            }));
        }
    };

    const validarEjercicio = () => {
        let hayErrores = false;
        let todasRellenas = true;

        const nuevoGrid = grid.map(casilla => {
            if (casilla.type !== TIPO_CASILLA.ADIVINABLE) return casilla;

            if (casilla.currentText === '?') {
                todasRellenas = false;
                return casilla;
            }

            const isCorrect = casilla.currentText === casilla.realText;
            if (!isCorrect) hayErrores = true;

            return { ...casilla, status: isCorrect ? ESTADO_CASILLA.CORRECTO : ESTADO_CASILLA.FALLO };
        });

        setGrid(nuevoGrid);

        if (!todasRellenas) {
            setEsCorrecto(false);
            setMensajeFeedback('Aún quedan interrogantes por resolver.');
            setMostrarFeedback(true);
        } else if (hayErrores) {
            setEsCorrecto(false);
            setMensajeFeedback('Prueba otra vez, hay resultados incorrectos.');
            setMostrarFeedback(true);
        } else {
            setEsCorrecto(true);
            setMensajeFeedback('¡Perfecto! Has completado la tabla.');
            setMostrarFeedback(true);
        }
    };

    return (
        <>
            <div className="actividad-layout tablas-layout-custom">
                <div className="panel-cuadricula">
                    <div className="tablas-grid-container tablas-multiplicar">
                        <TableroGrid grid={grid} onCellClick={handleCellClick} onKeyDown={handleKeyDownGrid} />
                    </div>
                </div>

                <div className="panel-derecho breadcrumb-tablas">
                    <Header rutas={[
                        { label: 'Actividad operaciones', path: '/operaciones',icon: 'icon-operaciones' },
                        { label: 'Multiplicaciones', path: '/operaciones/multiplicaciones', icon: 'icon-multiplicaciones' },
                        { label: 'Tablas de multiplicar', icon: 'icon-tablas' }]}
                        backPath="/operaciones/multiplicaciones" />

                    <ActividadControles
                        dificultad={dificultad}
                        onChange={cambiarDificultad}
                        onReiniciar={reiniciarJuego}
                        onInfoClick={() => setMostrarInfo(true)}
                    />

                    <div className="input-panel-tablas">
                        <div className="pickers-container">
                            <SwipePicker opciones={OPCIONES_DECENAS} value={idxDecenas} onChange={setIdxDecenas} />
                            <SwipePicker opciones={OPCIONES_UNIDADES} value={idxUnidades} onChange={setIdxUnidades} />
                        </div>
                        <div className="actividad-footer">
                            <button
                                id="celda-btn-corregir"
                                className="btn-corregir-full hover-primary"
                                onClick={validarEjercicio}
                                onKeyDown={(e) => handleFlechas(e, 'btn-corregir')}
                            >
                                {TEXTOS.global.corregir}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ModalInfo
                isOpen={mostrarInfo}
                onClose={() => setMostrarInfo(false)}
                mensaje={TEXTOS.infoActividades.tablasMultiplicar}
            />

            <ModalFeedback
                isOpen={mostrarFeedback}
                onClose={() => setMostrarFeedback(false)}
                esCorrecto={esCorrecto}
                mensaje={mensajeFeedback}
            />
        </>
    );
}