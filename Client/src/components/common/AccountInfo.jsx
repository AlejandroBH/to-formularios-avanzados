import '../../styles/account.css';

const AccountInfo = ({ user }) => {
    return (
        <div className="account-card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="card-icon">📋</span>
                    Información Personal
                </h2>
            </div>
            <div className="card-content">
                <div className="info-row">
                    <span className="info-label">Nombre de usuario</span>
                    <span className="info-value">{user.name}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Correo electrónico</span>
                    <span className="info-value">{user.email}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Fecha de registro</span>
                    <span className="info-value">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }) : 'No disponible'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AccountInfo;
