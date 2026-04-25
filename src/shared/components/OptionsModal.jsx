import { Icon } from './Icon';

export function OptionsModal({ isOpen, onClose, toggleTheme, isDark }) {
  if (!isOpen) return null; // Si no esta abierto, no se renderiza

  return (
    // Fondo oscuro semitransparente. Al hacer clic fuera del modal, se cierra.
    <div className="modal-overlay" onClick={onClose}>
      
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2 className='modal-title'><Icon name="icon-ajustes" /> Opciones</h2>
          <button className="icon-btn close-btn hover-danger" onClick={onClose} >
            <Icon name="icon-close" />
          </button>
        </div>

        <div className="modal-body">
          <div className='modal-legend'>Tema de la aplicación</div>
          
          <div className="theme-toggle-buttons">
            <button className={`theme-btn ${!isDark ? 'active' : ''}`} onClick={() => toggleTheme('light')}>
                <Icon name="icon-light" className='theme-btn-icon'/>
              Claro
            </button>
            <button className={`theme-btn ${isDark ? 'active' : ''}`} onClick={() => toggleTheme('dark')}>
                <Icon name="icon-dark" className='theme-btn-icon'/>
              Oscuro
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}