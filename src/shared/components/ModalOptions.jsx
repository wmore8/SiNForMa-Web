import { Icon } from './Icon';
import { Modal } from './Modal';

export function OptionsModal({ isOpen, onClose, toggleTheme, isDark }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="Opciones" icono="icon-ajustes" >
      
      <div className='modal-legend'>Tema de la aplicación</div>

      <div className="theme-toggle-buttons">
        <button className={`theme-btn ${!isDark ? 'active' : ''}`} onClick={() => toggleTheme('light')}>
          <Icon name="icon-light" className='theme-btn-icon' />
          Claro
        </button>
        <button className={`theme-btn ${isDark ? 'active' : ''}`} onClick={() => toggleTheme('dark')}>
          <Icon name="icon-dark" className='theme-btn-icon' />
          Oscuro
        </button>
      </div>
    </Modal>
  );
}