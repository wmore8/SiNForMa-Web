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
                    const isSameAsBack = ruta.path === backPath;

                    return (
                        <span key={index} className="breadcrumb-item-wrapper">
                            {isSameAsBack || !ruta.path ? (
                                <span className="breadcrumb-link-static">
                                    <Icon name={nombreIcono} className="breadcrumb-icon" />
                                    <span className="breadcrumb-texto-oculto-movil">{ruta.label}</span>
                                </span>
                            ) : (
                                <Link to={ruta.path} className="breadcrumb-link" aria-label={`Ir a ${ruta.label}`}>
                                    <Icon name={nombreIcono} className="breadcrumb-icon" />
                                    <span className="breadcrumb-texto-oculto-movil">{ruta.label}</span>
                                </Link>
                            )}
                            <span className="breadcrumb-separator">/</span>
                        </span>
                    );
                })}
            </div>

            <Link to={backPath} className="icon-btn btn-volver hover-danger" aria-label="Volver atrás">
                <Icon name="icon-back" />
            </Link>
        </header>
    );
}