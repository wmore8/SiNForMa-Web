import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export function ActivityCard({ title, iconName, path, debug = false }) {
    return (
        <Link to={path} className={`card ${debug ? 'debug' : ''}`}>
            <div className={`card-icon-container`}>
                <Icon name={iconName} className="card-icon" />
            </div>
            <h2 className="card-title">{title}</h2>
        </Link>
    );
}