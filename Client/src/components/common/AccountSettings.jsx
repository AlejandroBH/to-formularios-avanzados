import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/account.css';

const AccountSettings = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            navigate('/login');
        }
    };

    return (
        <div className="account-card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="card-icon">⚙️</span>
                    Configuración de Cuenta
                </h2>
            </div>
            <div className="card-content">
                <div className="settings-section">
                    <h3 className="settings-subtitle">Sesión</h3>
                    <button className="btn-settings btn-logout" onClick={handleLogout}>
                        <span className="btn-icon">🚪</span>
                        Cerrar Sesión
                    </button>
                </div>

                {showConfirm && (
                    <div className="confirm-modal">
                        <div className="confirm-content">
                            <h3 className="confirm-title">¿Estás seguro?</h3>
                            <p className="confirm-text">
                                Esta acción no se puede deshacer. Se eliminarán todos tus datos permanentemente.
                            </p>
                            <div className="confirm-actions">
                                <button className="btn-confirm btn-cancel" onClick={() => setShowConfirm(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountSettings;
