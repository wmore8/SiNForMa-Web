// src/pages/ActividadTablas.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../shared/components/Icon';
import { MiNumero } from '../shared/utils/MiNumero';
import { SpinnerCustom } from '../shared/components/SpinnerCustom';
import '../styles/ActividadTablas.css';

//Constantes de estado
const TIPO_CASILLA = { VISIBLE: 'visible', ADIVINABLE: 'guessable', CUBIERTA: 'covered' };
const ESTADO_CASILLA = { BASE: 'idle', CORRECTO: 'correct', FALLO: 'error' }

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

  // Estado de los Spinners
  const [digitoIzq, setDigitoIzq] = useState(0);
  const [digitoDer, setDigitoDer] = useState(0);

  // Handlers
  const cambiarDificultad = (e) => {
    const nuevoNivel = e.target.value;
    setDificultad(nuevoNivel); // Actualizamos la dificultad
    setGrid(crearNuevoTablero(nuevoNivel)); // Reprinteamos el tablero una sola vez
    setDigitoIzq(0);
    setDigitoDer(0);
  };

  const reiniciarJuego = () => {
    setGrid(crearNuevoTablero(dificultad));
    setDigitoIzq(0);
    setDigitoDer(0);
  };

  // Equivalente a changeValue(Button bClicked)
  const handleCellClick = (casilla) => {
    if (casilla.type === TIPO_CASILLA.ADIVINABLE) {
      setGrid(grid.map(c => {
        if (c.id === casilla.id) {
          let textoSpinner = digitoIzq === 0
            ? MiNumero.getSimbolo(digitoDer)
            : MiNumero.getSimbolo(digitoIzq) + MiNumero.getSimbolo(digitoDer);
          return { ...c, currentText: textoSpinner, status: ESTADO_CASILLA.BASE };
        }
        return c;
      }));
    }
  };

  const validarEjercicio = () => {
    setGrid(grid.map(casilla => {
      if (casilla.type !== TIPO_CASILLA.ADIVINABLE || casilla.currentText === '?') return casilla;
      return { ...casilla, status: casilla.currentText === casilla.realText ? ESTADO_CASILLA.CORRECTO : ESTADO_CASILLA.FALLO };
    }));
  };

  return (
    <div className="actividad-layout">
      <div className="panel-cuadricula">
        <div className="tablas-grid">
          {grid.map(casilla => (
            <div
              key={casilla.id}
              className={`tabla-celda ${casilla.type} ${casilla.status}`}
              onClick={() => handleCellClick(casilla)}
            >
              {casilla.currentText}
            </div>
          ))}
        </div>
      </div>

      <div className="panel-derecho">
        <header className="actividad-header">
          <div className="breadcrumb">
            <Icon name="icon-default" /> <span>Actividad Tablas</span>
          </div>
          <Link to="/" className="icon-btn btn-volver" style={{ color: 'var(--text-color)' }}>
            <Icon name="icon-back" />
          </Link>
        </header>

        <div className="panel-controles">
          <div className="controles-superiores">
            <button className="icon-btn" style={{ color: 'var(--text-color)' }} title='Información'>
              <Icon name="icon-info" />
            </button>
            <select value={dificultad} className='dificultad-select' onChange={cambiarDificultad}>
              <option value="0">Dificultad Fácil</option>
              <option value="1">Dificultad Media</option>
              <option value="2">Dificultad Difícil</option>
            </select>
            <button className="btn-secundario danger" onClick={() => reiniciarJuego(dificultad)}>Reiniciar</button>
          </div>
        </div>

        <div className="input-panel">
          <div className="spinners-wrapper">
            <SpinnerCustom value={digitoIzq} onChange={setDigitoIzq} />
            <SpinnerCustom value={digitoDer} onChange={setDigitoDer} />
          </div>
          <button className="btn-primario btn-corregir" onClick={validarEjercicio}>Corregir</button>
        </div>

      </div>
    </div>
  );
}