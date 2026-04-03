import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Icon } from './Icon';

const navLinks = [
    { name: 'Tablas', path: '/tablas', icon: 'icon-default' },
    { name: 'Lapiceros', path: '/lapiceros', icon: 'icon-lapiz' },
    { name: 'Palabras', path: '/palabras', icon: 'icon-default' },
    { name: 'Números', path: '/numeros', icon: 'icon-default' },
    { name: 'Operaciones', path: '/operaciones', icon: 'icon-default' }
];

export function Navbar({ onOpenSettings }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="navbar-header">
            <nav className="navbar">

                <Link to={'/'} className="nav-brand" onClick={closeMenu}>
                    <Icon name='icon-default' className="brand-icon" />
                    <h1>SiNForMa</h1>
                </Link>

                <div className={`nav-links-container ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-links">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <NavLink to={link.path} className="nav-link" onClick={closeMenu}>
                                    <Icon name={link.icon} className="nav-link-icon" />
                                    <span>{link.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="nav-actions">
                    <button className="icon-btn" title='Ajustes' onClick={onOpenSettings}>
                        <Icon name={"icon-ajustes"} className="ajustes-icon" />
                    </button>

                    <button className="icon-btn mobile-menu-btn" onClick={toggleMenu} title={isMenuOpen ? 'Cerrar' : 'Abrir'}>
                        <Icon name="icon-nav-toggle" className={`hamburger-icon ${isMenuOpen ? 'rotated' : ''}`} />
                    </button>
                </div>

            </nav>
        </header>
    );
}