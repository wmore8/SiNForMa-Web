import { useState } from 'react';
import { Header } from './Header';
import { ActividadControles } from './ActividadControles';
import { ModalInfo } from './ModalInfo';
import { TEXTOS } from '../../constants/textos';
import { ModalFeedback } from './ModalFeedback';

export function ActividadLayout({ 
    // Props del Header
    rutas, 
    backPath, 
    // Props de los Controles
    dificultad, 
    opcionesDificultad, 
    onChangeDificultad, 
    onReiniciar, 
    // Props del Info
    textoInfo, 
    // Props del Feedback
    mostrarFeedback, 
    esCorrecto, 
    onCerrarFeedback,
    // Mensajes exito o error
    mensajeExito = TEXTOS.feedback.exitoGenerico, 
    mensajeError = TEXTOS.feedback.errorGenerico,
    // Estructura
    className = "",
    children 
}) {

    // Estado del modal de informacion
    const [infoAbierta, setInfoAbierta] = useState(false);

    return (
        <div className={`actividad-layout ${className}`}>
            <Header rutas={rutas} backPath={backPath} />

            {/* Renderizamos controles si nos pasan la función de cambiar dificultad */}
            {onChangeDificultad && onReiniciar && (
                <ActividadControles 
                    dificultad={dificultad} 
                    opciones={opcionesDificultad} 
                    onChange={onChangeDificultad} 
                    onReiniciar={onReiniciar} 
                    onInfoClick={() => setInfoAbierta(true)} 
                />
            )}

            {/* Aqui se inyecta el contenido principal de la actividad  */}
            {children}

            {/* MODALES CENTRALIZADOS */}
            <ModalInfo 
                isOpen={infoAbierta} 
                onClose={() => setInfoAbierta(false)} 
                mensaje={textoInfo} 
            />

            {/* Si la actividad no usa feedback, no se renderiza */}
            {mostrarFeedback !== undefined && (
                <ModalFeedback 
                    isOpen={mostrarFeedback} 
                    onClose={onCerrarFeedback} 
                    esCorrecto={esCorrecto} 
                    mensaje={esCorrecto ? mensajeExito : mensajeError}
                />
            )}
        </div>
    );
}