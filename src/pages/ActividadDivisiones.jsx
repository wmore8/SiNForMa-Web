import { useState } from 'react';
import { MiNumero } from '../shared/utils/MiNumero';
import { ActividadLayout } from '../shared/components/ActividadLayout';
import { CeldaInteractiva } from '../shared/components/CeldaInteractiva';
import { PanelTeclado } from '../shared/components/PanelTeclado';
import { TEXTOS } from '../constants/textos';
import { useNavegacionFlechas } from '../shared/hooks/useNavegacionFlechas';
import { useAutoFocoInicial } from '../shared/hooks/useAutoFocoInicial';
import '../styles/ActividadOperaciones.css';

const generarDivision = (nivel) => {
    const rand = (max) => Math.floor(Math.random() * max);
    const base = MiNumero.baseActual;
    let dividendo = 0;
    let divisor = 1;

    if (nivel === '0') {
        // Facil: 1 cifra / 1 cifra (divisor siempre > 0)
        dividendo = rand(base);
        divisor = rand(base - 1) + 1;
    } else if (nivel === '1') {
        // Medio: División de hasta 2 cifras por 1 (fuerza que sea exacta originalmente)
        const minVal = base;
        const maxVal = base * base;
        divisor = Math.floor(Math.random() * (base - 2)) + 2;
        const cociente = Math.floor(Math.random() * (maxVal - minVal)) + minVal;
        dividendo = divisor * cociente;
    } else {
        // Dificil: 3 cifras / 2 cifras
        dividendo = rand(Math.pow(base, 3));
        divisor = rand(Math.pow(base, 2) - 1) + 1;
    }

    // Calculamos cociente y resto exactos en base 10 y luego los convertimos a la base actual
    const cocienteDecimal = Math.floor(dividendo / divisor);
    const restoDecimal = dividendo % divisor;

    return {
        num1Str: dividendo.toString(base),
        num2Str: divisor.toString(base),
        solucionCociente: cocienteDecimal.toString(base),
        solucionResto: restoDecimal.toString(base)
    };
};

export function ActividadDivisiones() {
    const [dificultad, setDificultad] = useState('0');
    const [ejercicio, setEjercicio] = useState(() => generarDivision('0'));

    const celdasVacias = { cociente: '', resto: '' };
    const [celdas, setCeldas] = useState(celdasVacias);
    const [feedback, setFeedback] = useState(celdasVacias);
    const [celdaActiva, setCeldaActiva] = useState(null);

    // Mapa de navegacion de flechas
    const navegacionGrid = [
        ['cociente', 'resto'],
        ['btn-corregir', 'btn-corregir']
    ];

    const handleFlechas = useNavegacionFlechas(navegacionGrid, setCeldaActiva);
    useAutoFocoInicial(ejercicio, 'celda-cociente', setCeldaActiva);

    // Estados para los modales
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [esCorrecto, setEsCorrecto] = useState(false);

    const reiniciarTodo = () => {
        setEjercicio(generarDivision(dificultad));
        setCeldas(celdasVacias);
        setFeedback(celdasVacias);
        setCeldaActiva(null);
        setMostrarFeedback(false);
    };


    const cambiarDificultad = (e) => {
        const nuevoNivel = e.target.value;
        setDificultad(nuevoNivel);
        reiniciarTodo(nuevoNivel);
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
                nuevoValor = valorActual.slice(0, -1);
            } else {
                // Permitimos hasta 5 caracteres por si es una division grande
                if (valorActual.length < 5) nuevoValor = valorActual + tecla;
            }
            return { ...prev, [celdaActiva]: nuevoValor };
        });

        // Limpiamos el borde de la celda que se esta editando
        setFeedback(prev => ({ ...prev, [celdaActiva]: '' }));
    };

    const renderCelda = (id) => (
        <CeldaInteractiva
            key={id}
            id={id}
            textoPersonalizado={celdas[id] !== '' ? renderizarSimbolos(celdas[id]) : ''}
            isActive={celdaActiva === id}
            feedback={feedback[id]}
            onSelect={setCeldaActiva}
            handleFlechas={handleFlechas}
            claseBase="celda-ancha"
        />
    )

    // Helper para convertir un string base 8 en simbolos Romescos
    const renderizarSimbolos = (strBase8) => {
        return strBase8.split('').map((char, i) => (
            <span key={i}>{new MiNumero(parseInt(char, 10)).toString()}</span>
        ));
    };

    const validarEjercicio = () => {
        let todoCorrecto = true;
        const nuevoFeedback = { ...feedback };

        const comprobarCelda = (id, valorEsperado) => {
            const usuarioVal = celdas[id].trim();
            const usuarioLimpiado = usuarioVal.replace(/^0+/, '') || '0';
            const esperadoLimpiado = valorEsperado.trim().replace(/^0+/, '') || '0';

            let esCorrecta = false;
            // Si la celda se deja vacia cuando se espera un numero (incluido el 0), es incorrecto
            if (usuarioVal === '') {
                esCorrecta = false;
            } else if (usuarioLimpiado === esperadoLimpiado || usuarioVal === valorEsperado.trim()) {
                esCorrecta = true;
            }

            nuevoFeedback[id] = esCorrecta ? 'correcta' : 'erronea';
            if (!esCorrecta) todoCorrecto = false;
        };

        comprobarCelda('cociente', ejercicio.solucionCociente);
        comprobarCelda('resto', ejercicio.solucionResto);

        setFeedback(nuevoFeedback);
        setCeldaActiva(null);
        setEsCorrecto(todoCorrecto);
        setMostrarFeedback(true);
        if (document.activeElement) document.activeElement.blur();
    };

    return (
        <ActividadLayout
            rutas={[
                { label: TEXTOS.titulos.operaciones, path: '/operaciones', icon: 'icon-operaciones' },
                { label: TEXTOS.titulos.divisiones, icon: 'icon-division' }
            ]}
            backPath="/operaciones"
            dificultad={dificultad}
            onChangeDificultad={cambiarDificultad}
            onReiniciar={reiniciarTodo}
            textoInfo={TEXTOS.infoActividades.divisiones}
            mostrarFeedback={mostrarFeedback}
            esCorrecto={esCorrecto}
            onCerrarFeedback={() => setMostrarFeedback(false)}
            className="multiplicacion-layout-custom modo-dificil"
        >
            <main className="actividad-zona-juego">
                <div className='panel-izquierdo'>
                    <div className={`operacion-original`}>
                        {/* Dividendo */}
                        <div className="numero-fijo">
                            {renderizarSimbolos(ejercicio.num1Str)}
                        </div>

                        <div className="signo-matematico">÷</div>
                        {/* Divisor */}
                        <div className="numero-fijo">
                            {renderizarSimbolos(ejercicio.num2Str)}
                        </div>
                    </div>
                    {/* Cajas de Cociente y Resto usando las utilidades de Recortados para el Label */}
                    <div className='division-celdas-container'>
                        <div className='division-celda'>
                            <span className="etiqueta-recortado">Resto</span>
                            {renderCelda('resto')}
                        </div>
                        <div  className='division-celda' >
                            <span className="etiqueta-recortado">Cociente</span>
                            {renderCelda('cociente')}
                        </div>
                    </div>
                </div>
                <PanelTeclado
                    onTeclaClick={handleTeclaClick}
                    onCorregir={validarEjercicio}
                    handleFlechas={handleFlechas}
                    deshabilitado={mostrarFeedback}
                />
            </main>
        </ActividadLayout>
    );
}