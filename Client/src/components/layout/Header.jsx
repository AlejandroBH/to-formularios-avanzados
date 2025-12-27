import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
        setIsMenuOpen(false);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-logo">
                    <a href="/">
                        <span className="logo-icon">📝</span>
                        <span className="logo-text">MyApp</span>
                    </a>
                </div>

                <button
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <a href="/" onClick={closeMenu}>Productos</a>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <a href="/favorites" onClick={closeMenu}>Favoritos</a>
                                </li>
                                <li className="nav-item">
                                    <a href="/account" onClick={closeMenu}>Mi Cuenta</a>
                                </li>
                                <li className="nav-item">
                                    <button className="btn-logout" onClick={handleLogout}>
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button className="btn-login" onClick={handleLogin}>
                                    Iniciar Sesión
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;

