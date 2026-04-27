import { Link } from 'react-router-dom';
import { Icon } from '../shared/components/Icon';
import { TEXTOS } from '../constants/textos';

export function NotFound() {
    return (
        <div className="actividad-layout">
            <div className="not-found-wrapper">
                
                <Icon name="icon-warning" className="not-found-icon" />
                
                <h1 className="not-found-code">404</h1>
                
                <h2 className="not-found-subtitle">
                    {TEXTOS.ui.notFound.subtitulo}
                </h2>
                
                <p className="not-found-text">
                    {TEXTOS.ui.notFound.mensaje}
                </p>

                <Link to="/" className="not-found-btn-container">
                    <button className="btn-corregir-full hover-primary">
                        {TEXTOS.ui.notFound.botonHome}
                    </button>
                </Link>

            </div>
        </div>
    );
}