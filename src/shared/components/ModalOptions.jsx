import { Icon } from './Icon';
import { Modal } from './Modal';
import { TEXTOS } from '../../constants/textos';

export function OptionsModal({ isOpen, onClose, toggleTheme, isDark, textSize, changeTextSize, visionMode, changeVisionMode, navFill, changeNavFill }) {

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="Opciones" icono="icon-ajustes" >


      {/* SECCION TAMAÑO DE TEXTO */}
      <h3 className='modal-legend'>{TEXTOS.ui.opciones.tituloFuente}</h3>
      <div className="slider-container">

        {/* Nuestro propio slider customizado */}
        <div className="custom-discrete-slider">
          <div className="slider-track"></div>

          <button className={`slider-step ${textSize === 'sm' ? 'active' : ''}`} onClick={() => changeTextSize('sm')} />
          <button className={`slider-step ${textSize === 'md' ? 'active' : ''}`} onClick={() => changeTextSize('md')} />
          <button className={`slider-step ${textSize === 'lg' ? 'active' : ''}`} onClick={() => changeTextSize('lg')} />
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
        <button className={`theme-btn ${visionMode === 'monocromatico' ? 'active' : ''}`} onClick={() => changeVisionMode('monocromatico')}>
          {TEXTOS.ui.opciones.acromatopsia}
        </button>
        <button className={`theme-btn ${visionMode === 'protanopia' ? 'active' : ''}`} onClick={() => changeVisionMode('protanopia')}>
          {TEXTOS.ui.opciones.protanopia}
        </button>
        <button className={`theme-btn ${visionMode === 'deuteranopia' ? 'active' : ''}`} onClick={() => changeVisionMode('deuteranopia')}>
          {TEXTOS.ui.opciones.deuteranopia}
        </button>
        <button className={`theme-btn ${visionMode === 'tritanopia' ? 'active' : ''}`} onClick={() => changeVisionMode('tritanopia')}>
          {TEXTOS.ui.opciones.tritanopia}
        </button>
      </div>

      {import.meta.env.SINFORMA_MODO_DEBUG === 'true' && (
        <>
          {/* SECCION DEBUG BASE */}
          <h3 className='modal-legend' style={{ marginTop: '1.5rem', color: 'var(--danger)' }}>Debug: Sistema Numérico</h3>
          <div className="theme-toggle-buttons">
            <button
              className={`theme-btn ${localStorage.getItem('debugBase') === '8' || (!localStorage.getItem('debugBase') && import.meta.env.SINFORMA_APP_SISTEMA_NUMERACION === '8') ? 'active' : ''}`}
              onClick={() => { localStorage.setItem('debugBase', '8'); window.location.reload(); }}
            >
              Romesco (Base 8)
            </button>
            <button
              className={`theme-btn ${localStorage.getItem('debugBase') === '10' || (!localStorage.getItem('debugBase') && import.meta.env.SINFORMA_APP_SISTEMA_NUMERACION === '10') ? 'active' : ''}`}
              onClick={() => { localStorage.setItem('debugBase', '10'); window.location.reload(); }}
            >
              Decimal (Base 10)
            </button>
          </div>

          {/* VERSION TEXT */}
          <p style={{ marginTop: '2rem', textAlign: 'center', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.7 }}>
            SiNForMa Web Development version 0.8.4
          </p>
        </>
      )}
    </Modal>
  );
}