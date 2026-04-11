import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import '../../styles/Header.css';

export function Header({ rutas = [], backPath = '/' }) {
    return (
        <header className="actividad-header">
            <div className="breadcrumb">
                {rutas.map((ruta, index) => {
                    // Si es el ultimo elemento del array, es la pagina actual (sin enlace)
                    const isLast = index === rutas.length - 1;
                    const nombreIcono = ruta.icon || 'icon-default';

                    if (isLast) {
                        return (
                            <span key={index} className="breadcrumb-current">
                                <Icon name={nombreIcono} className="breadcrumb-icon" />
                                <span>{ruta.label}</span>
                            </span>
                        );
                    }

                    // Si NO es el ultimo, es un nivel anterior
                    return (
                        <span key={index} className="breadcrumb-item-wrapper">
                            <Link to={ruta.path} className="breadcrumb-link" title={ruta.label}>
                                <Icon name="icon-default" className="breadcrumb-icon" />
                                <span className="breadcrumb-texto-oculto-movil">{ruta.label}</span>
                            </Link>
                            <span className="breadcrumb-separator">/</span>
                        </span>
                    );
                })}
            </div>

            <Link to={backPath} className="icon-btn btn-volver" style={{ color: 'var(--text-color)' }} title="Volver">
                <Icon name="icon-back" />
            </Link>
        </header>
    );
}