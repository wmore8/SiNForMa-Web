import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../shared/components/Icon';
import { MiNumero } from '../shared/utils/MiNumero';
import { TableroGrid } from '../shared/components/TableroGrid';
import { SwipePicker } from '../shared/components/SwipePicker';
import { Header } from '../shared/components/Header';
import { ActividadControles } from '../shared/components/ActividadControles';
import { ModalInfo } from '../shared/components/ModalInfo';
import { ModalFeedback } from '../shared/components/ModalFeedback';
import { useNavegacionFlechas } from '../shared/hooks/useNavegacionFlechas';
import { useControlDoblePicker } from '../shared/hooks/useControlDoblePicker';
import { TEXTOS } from '../constants/textos';
import '../styles/ActividadTablas.css';

//Constantes de estado
const TIPO_CASILLA = { VISIBLE: 'visible', ADIVINABLE: 'guessable', CUBIERTA: 'covered' };
const ESTADO_CASILLA = { BASE: 'idle', CORRECTO: 'correct', FALLO: 'error' }

// Arrays de opciones para los Pickers 
const DIGITOS = MiNumero.losDigitos;
const OPCIONES_UNIDADES = [...DIGITOS]; // Del 0 al 7
const OPCIONES_DECENAS = [' ', ...DIGITOS.slice(1)]; // Blanco + 1 a 7

const generarTablero = (tipo, estado, texto) => {
  //Tablero inicial -> todo visible
  let tablero = [];
  for (let i = 0; i < 8; i++) {
    let fila = [];
    for (let j = 0; j < 8; j++) {
      const numeroReal = new MiNumero(i * 10 + j).toString();
      fila.push({
        id: `${i}-${j}`, i, j, realText: numeroReal,
        currentText: texto === null ? numeroReal : texto,
        type: tipo, // Puede ser: 'visible', 'guessable', 'covered'
        status: estado // 'idle', 'correct', 'error'
      });
    }
    tablero.push(fila);
  }
  return tablero;
};

const modificarCasilla = (tablero, posFila, posColumna, tipo, estado, texto) => {
  tablero[posFila][posColumna].type = tipo;
  tablero[posFila][posColumna].status = estado;
  tablero[posFila][posColumna].currentText = texto;
};

const newExercise0 = () => {
  // Facil: 20% aleatorio para adivinar, el resto sigue visible
  let tablero = generarTablero(TIPO_CASILLA.VISIBLE, ESTADO_CASILLA.BASE, null);

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (Math.random() < 0.20) {
        modificarCasilla(tablero, i, j, TIPO_CASILLA.ADIVINABLE, ESTADO_CASILLA.BASE, '?');
      }
    }
  }
  return tablero;
};

const newExercise1 = () => {
  //Borra dos cuadrados de tamaño 3. Pueden solaparse
  let tablero = generarTablero(TIPO_CASILLA.VISIBLE, ESTADO_CASILLA.BASE, null);
  let sizeSquare = 3;
  let variante = Math.floor(Math.random() * 2); //variable para decidir que tipo variante sale

  if (variante === 0) {
    //Borrar una fila y columna entera
    let posFila = Math.floor(Math.random() * 8);
    let posColumna = Math.floor(Math.random() * 8);
    for (let k = 0; k < 8; k++) {
      modificarCasilla(tablero, posFila, k, TIPO_CASILLA.CUBIERTA, ESTADO_CASILLA.BASE, '');
      modificarCasilla(tablero, k, posColumna, TIPO_CASILLA.CUBIERTA, ESTADO_CASILLA.BASE, '');
    }
    //la casilla interseccion es adivinable
    modificarCasilla(tablero, posFila, posColumna, TIPO_CASILLA.ADIVINABLE, ESTADO_CASILLA.BASE, '?');

  } else {

    //Borrar los dos cuadrados
    for (let cuadrado = 1; cuadrado <= 2; cuadrado++) {
      let posFila = Math.floor(Math.random() * (8 - sizeSquare));
      let posColumna = Math.floor(Math.random() * (8 - sizeSquare));
      //borramos todas las posiciones del cuadrado
      for (let i = posFila; i < posFila + sizeSquare; i++) {
        for (let j = posColumna; j < posColumna + sizeSquare; j++) {
          modificarCasilla(tablero, i, j, TIPO_CASILLA.CUBIERTA, ESTADO_CASILLA.BASE, '');
        }
      }
      //una vez hecho los cuadrados, dejamos que la casilla central sea adivinable
      modificarCasilla(tablero, posFila + 1, posColumna + 1, TIPO_CASILLA.ADIVINABLE, ESTADO_CASILLA.BASE, '?');
    }
  }

  // Borrar otras tres posiciones aleatorias
  for (let i = 0; i < 3; i++) {
    let posFila = Math.floor(Math.random() * (8 - sizeSquare));
    let posColumna = Math.floor(Math.random() * (8 - sizeSquare));
    modificarCasilla(tablero, posFila, posColumna, TIPO_CASILLA.ADIVINABLE, ESTADO_CASILLA.BASE, '?');
  }
  return tablero;
};

const newExercise2 = () => {
  //inicializamos el tablero entero sin casillas visibles
  let tablero = generarTablero(TIPO_CASILLA.CUBIERTA, ESTADO_CASILLA.BASE, '?');
  //la casilla inicial siempre es visible
  modificarCasilla(tablero, 0, 0, TIPO_CASILLA.VISIBLE, ESTADO_CASILLA.BASE, new MiNumero(0).toString());
  let min = 5, max = 7;
  let numGuessables = Math.floor(Math.random() * (max - min) + min);
  let puestas = 0;
  while (puestas < numGuessables) {
    let posFila = Math.floor(Math.random() * 8);
    let posColumna = Math.floor(Math.random() * 8);
    modificarCasilla(tablero, posFila, posColumna, TIPO_CASILLA.ADIVINABLE, ESTADO_CASILLA.BASE, '?');
    puestas++;
  }
  return tablero;
}

export function ActividadTablas() {
  const [dificultad, setDificultad] = useState('0'); // 0: Facil, 1: Medio, 2: Dificil

  // Solo devuelve el tablero, no actualiza estados directamente
  const crearNuevoTablero = (nivelActual) => {
    let nuevoTablero;
    switch (nivelActual) {
      case '0': nuevoTablero = newExercise0(); break;
      case '1': nuevoTablero = newExercise1(); break;
      case '2': nuevoTablero = newExercise2(); break;
      default: nuevoTablero = newExercise0(); break;
    }
    return nuevoTablero.flat(); // Devolvemos el tablero con estructura plana
  };

  // Inicializamos el estado usando la funcion pura
  const [grid, setGrid] = useState(() => crearNuevoTablero('0'));

  // Estados para controlar los modales manualmente
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [esCorrecto, setEsCorrecto] = useState(false);
  const [mensajeFeedback, setMensajeFeedback] = useState("");

  // Estados para los SwipePickers
  const [idxDecenas, setIdxDecenas] = useState(0);
  const [idxUnidades, setIdxUnidades] = useState(0);

  // Mapa de navegacion dinamico basado en las casillas adivinables actuales
  const navegacionGrid = useMemo(() => {
    let nGrid = [];
    for (let i = 0; i < 8; i++) {
      let fila = [];
      for (let j = 0; j < 8; j++) {
        const c = grid[i * 8 + j]; // Como grid es flat y de 8x8, la formula directa sirve
        if (c && c.type === TIPO_CASILLA.ADIVINABLE) {
          fila.push(c.id);
        } else {
          fila.push(null);
        }
      }
      nGrid.push(fila);
    }
    nGrid.push(Array(8).fill('btn-corregir'));
    return nGrid;
  }, [grid]);

  // Pasamos 'null' como onActivarCelda ya que no tenemos estado celdaActiva
  const handleFlechas = useNavegacionFlechas(navegacionGrid, null, mostrarFeedback || mostrarInfo);

  // Manejador del teclado exclusivo para la cuadricula
  const handleKeyDownGrid = useControlDoblePicker(idxDecenas, setIdxDecenas, idxUnidades, setIdxUnidades, handleFlechas);

  // Handler del evento
  const cambiarDificultad = (e) => {
    const nuevoNivel = e.target.value;
    setDificultad(nuevoNivel); // Actualizamos la dificultad
    setGrid(crearNuevoTablero(nuevoNivel)); // Reprinteamos el tablero una sola vez
    setIdxDecenas(0);
    setIdxUnidades(0);
  };

  const reiniciarJuego = () => {
    setGrid(crearNuevoTablero(dificultad));
    setIdxDecenas(0);
    setIdxUnidades(0);
  };

  // Equivalente a changeValue(Button bClicked)
  const handleCellClick = (casilla) => {
    if (casilla.type === TIPO_CASILLA.ADIVINABLE) {
      setGrid(grid.map(c => {
        if (c.id === casilla.id) {
          const charDecena = OPCIONES_DECENAS[idxDecenas].trim();
          const charUnidad = OPCIONES_UNIDADES[idxUnidades].trim();
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
      // Ignoramos las que no son para adivinar
      if (casilla.type !== TIPO_CASILLA.ADIVINABLE) return casilla;

      // Si encontramos un '?', es que falta por rellenar
      if (casilla.currentText === '?') {
        todasRellenas = false;
        return casilla;
      }

      // Evaluamos acierto o fallo
      const esCorrecta = casilla.currentText === casilla.realText;
      if (!esCorrecta) hayErrores = true;

      return {
        ...casilla,
        status: esCorrecta ? ESTADO_CASILLA.CORRECTO : ESTADO_CASILLA.FALLO
      };
    });

    setGrid(nuevoGrid);

    if (!todasRellenas) {
      setEsCorrecto(false);
      setMensajeFeedback('Completa todas las casillas con "?"');
      setMostrarFeedback(true);
    } else if (hayErrores) {
      setEsCorrecto(false);
      setMensajeFeedback('¡Vaya! Revisa las casillas rojas.');
      setMostrarFeedback(true);
    } else {
      setEsCorrecto(true);
      setMensajeFeedback('¡Perfecto! Todo está correcto.');
      setMostrarFeedback(true);
    }
  };

  return (
    <>
      <div className="actividad-layout tablas-layout-custom">
        {/* Contenedor de la izquierda (Cuadricula) */}
        <div className="panel-cuadricula">
          <div className="tablas-grid-container">
            <TableroGrid grid={grid} onCellClick={handleCellClick} onKeyDown={handleKeyDownGrid} />
          </div>
        </div>

        {/* Contenedor de la derecha (Header y Controles) */}
        <div className="panel-derecho">
          <Header
            rutas={[{ label: TEXTOS.titulos.tablas }]} backPath="/" />

          <ActividadControles dificultad={dificultad} onChange={cambiarDificultad} onReiniciar={reiniciarJuego} onInfoClick={() => setMostrarInfo(true)} />

          <div className="input-panel-tablas">
            <div className="pickers-container">
              <SwipePicker
                opciones={OPCIONES_DECENAS}
                value={idxDecenas}
                onChange={setIdxDecenas}
              />
              <SwipePicker
                opciones={OPCIONES_UNIDADES}
                value={idxUnidades}
                onChange={setIdxUnidades}
              />
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

      <ModalInfo isOpen={mostrarInfo} onClose={() => setMostrarInfo(false)} mensaje={TEXTOS.infoActividades.tablas} />

      <ModalFeedback
        isOpen={mostrarFeedback}
        onClose={() => setMostrarFeedback(false)}
        esCorrecto={esCorrecto}
        mensaje={mensajeFeedback}
      />
    </>
  );
}