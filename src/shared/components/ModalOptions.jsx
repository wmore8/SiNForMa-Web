import { Icon } from './Icon';
import { Modal } from './Modal';
import { TEXTOS } from '../../constants/textos';

export function OptionsModal({ isOpen, onClose, toggleTheme, isDark, textSize, changeTextSize }) {

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="Opciones" icono="icon-ajustes" >


      {/* SECCION TAMAÑO DE TEXTO */}
      <div className='modal-legend'>{TEXTOS.ui.opciones.tituloFuente}</div>
      <div className="slider-container">

        {/* Nuestro propio slider customizado */}
        <div className="custom-discrete-slider">
          <div className="slider-track"></div>

          <button
            className={`slider-step ${textSize === 'sm' ? 'active' : ''}`}
            onClick={() => changeTextSize('sm')}
          />
          <button
            className={`slider-step ${textSize === 'md' ? 'active' : ''}`}
            onClick={() => changeTextSize('md')}
          />
          <button
            className={`slider-step ${textSize === 'lg' ? 'active' : ''}`}
            onClick={() => changeTextSize('lg')}
          />
        </div>

        <div className="slider-labels">
          <span className={textSize === 'sm' ? 'slider-active' : ''} onClick={() => changeTextSize('sm')}>
            {TEXTOS.ui.opciones.pequeno}
          </span>
          <span className={textSize === 'md' ? 'slider-active' : ''} onClick={() => changeTextSize('md')}>
            {TEXTOS.ui.opciones.medio}
          </span>
          <span className={textSize === 'lg' ? 'slider-active' : ''} onClick={() => changeTextSize('lg')}>
            {TEXTOS.ui.opciones.grande}
          </span>
        </div>
      </div>

      {/* SECCION TEMA */}
      <div className='modal-legend'>{TEXTOS.ui.opciones.tituloTema}</div>
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
    </Modal>
  );
}