import { Icon } from './Icon';
import { Modal } from './Modal';
import { TEXTOS } from '../../constants/textos';
import pkg from '../../../package.json';

export function OptionsModal({ isOpen, onClose, toggleTheme, isDark, textSize, changeTextSize, visionMode, changeVisionMode, navFill, changeNavFill, pwa }) {

  const { canInstall, isInstalled, isInstallSupported, needRefresh, handleInstall, handleUpdate } = pwa || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="Opciones" icono="icon-ajustes" >


      {/* SECCION TAMAÑO DE TEXTO */}
      <h3 className='modal-legend'>{TEXTOS.ui.opciones.tituloFuente}</h3>
      <div className="slider-container">

        {/* Nuestro propio slider customizado */}
        <div className="custom-discrete-slider">
          <div className="slider-track"></div>

          <button className={`slider-step ${textSize === 'sm' ? 'active' : ''}`} onClick={() => changeTextSize('sm')} aria-label={TEXTOS.ui.opciones.pequeno} />
          <button className={`slider-step ${textSize === 'md' ? 'active' : ''}`} onClick={() => changeTextSize('md')} aria-label={TEXTOS.ui.opciones.medio} />
          <button className={`slider-step ${textSize === 'lg' ? 'active' : ''}`} onClick={() => changeTextSize('lg')} aria-label={TEXTOS.ui.opciones.grande} />
        </div>

        <div className="slider-labels">
          <h4 className={textSize === 'sm' ? 'slider-active' : ''} onClick={() => changeTextSize('sm')}>
            {TEXTOS.ui.opciones.pequeno}
          </h4>
          <h4 className={textSize === 'md' ? 'slider-active' : ''} onClick={() => changeTextSize('md')}>
            {TEXTOS.ui.opciones.medio}
          </h4>
          <h4 className={textSize === 'lg' ? 'slider-active' : ''} onClick={() => changeTextSize('lg')}>
            {TEXTOS.ui.opciones.grande}
          </h4>
        </div>
      </div>

      {/* SECCION ESTILO DE INTERFAZ */}
      <h3 className='modal-legend'>{TEXTOS.ui.opciones.tituloNavBar}</h3>
      <div className="theme-toggle-buttons">
        <button className={`theme-btn ${!navFill ? 'active' : ''}`} onClick={() => changeNavFill(false)}>
          {TEXTOS.ui.opciones.plano}
        </button>
        <button className={`theme-btn ${navFill ? 'active' : ''}`} onClick={() => changeNavFill(true)}>
          {TEXTOS.ui.opciones.relleno}
        </button>
      </div>

      {/* SECCION TEMA */}
      <h3 className='modal-legend'>{TEXTOS.ui.opciones.tituloTema}</h3>
      <div className="theme-toggle-buttons">
        <button className={`theme-btn ${!isDark ? 'active' : ''}`} onClick={() => toggleTheme('light')}>
          <Icon name="icon-light" className='theme-btn-icon' />
          {TEXTOS.ui.opciones.claro}
        </button>
        <button className={`theme-btn ${isDark ? 'active' : ''}`} onClick={() => toggleTheme('dark')}>
          <Icon name="icon-dark" className='theme-btn-icon' />
          {TEXTOS.ui.opciones.oscuro}
        </button>
      </div>

      {/* ACCESIBILIDAD VISUAL */}
      <h3 className='modal-legend'>{TEXTOS.ui.opciones.tituloAccesibilidad}</h3>
      <div className="theme-toggle-buttons">
        <button className={`theme-btn ${visionMode === 'protanopia' ? 'active' : ''}`} onClick={() => changeVisionMode('protanopia')}>
          {TEXTOS.ui.opciones.protanopia}
        </button>
        <button className={`theme-btn ${visionMode === 'deuteranopia' ? 'active' : ''}`} onClick={() => changeVisionMode('deuteranopia')}>
          {TEXTOS.ui.opciones.deuteranopia}
        </button>
        <button className={`theme-btn ${visionMode === 'tritanopia' ? 'active' : ''}`} onClick={() => changeVisionMode('tritanopia')}>
          {TEXTOS.ui.opciones.tritanopia}
        </button>
        <button className={`theme-btn ${visionMode === 'monocromatico' ? 'active' : ''}`} onClick={() => changeVisionMode('monocromatico')}>
          {TEXTOS.ui.opciones.acromatopsia}
        </button>
      </div>

      {import.meta.env.SINFORMA_MODO_DEBUG === 'true' && (
        <>
          {/* SECCION DEBUG BASE */}
          <h3 className='modal-legend modal-legend-spaced debug-title'>{TEXTOS.ui.opciones.tituloDebugBase}</h3>
          <div className="theme-toggle-buttons">
            <button
              className={`theme-btn ${localStorage.getItem('debugBase') === '8' || (!localStorage.getItem('debugBase') && import.meta.env.SINFORMA_APP_SISTEMA_NUMERACION === '8') ? 'active' : ''} debug`}
              onClick={() => { localStorage.setItem('debugBase', '8'); window.location.reload(); }}
            >
              {TEXTOS.ui.opciones.baseRomes}
            </button>
            <button
              className={`theme-btn ${localStorage.getItem('debugBase') === '10' || (!localStorage.getItem('debugBase') && import.meta.env.SINFORMA_APP_SISTEMA_NUMERACION === '10') ? 'active' : ''} debug`}
              onClick={() => { localStorage.setItem('debugBase', '10'); window.location.reload(); }}
            >
              {TEXTOS.ui.opciones.baseDecimal}
            </button>
          </div>
        </>
      )}

      {/* SECCION ESTADO DE LA APP E INSTALACION */}
      <h3 className='modal-legend modal-legend-spaced'>{TEXTOS.ui.opciones.tituloEstadoApp}</h3>
      <div className="theme-toggle-buttons">
        {needRefresh ? (
          <button className="theme-btn active update" onClick={handleUpdate}>
            <Icon name="icon-update" className="theme-btn-icon" />
            {TEXTOS.ui.opciones.actualizar}
          </button>
        ) : isInstalled ? (
          <button className="theme-btn installed-status" disabled>
            <Icon name="icon-success" className="theme-btn-icon" />
            {TEXTOS.ui.opciones.instalada}
          </button>
        ) : canInstall ? (
          <button className="theme-btn active install" onClick={handleInstall}>
            <Icon name="icon-download" className="theme-btn-icon" />
            {TEXTOS.ui.opciones.instalar}
          </button>
        ) : (
          <button className="theme-btn disabled" disabled>
            <Icon name="icon-warning" className="theme-btn-icon" />
            {TEXTOS.ui.opciones.noCompatible}
          </button>
        )}
      </div>

      {/* VERSION TEXT DINAMICO */}
      <p className="pwa-version-text">
        SiNForMa Web {import.meta.env.SINFORMA_MODO_DEBUG === 'true' ? 'Development' : ''} v{pkg.version}
      </p>
    </Modal>
  );
}