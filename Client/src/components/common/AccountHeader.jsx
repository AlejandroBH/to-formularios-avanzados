import '../../styles/account.css';

const AccountHeader = ({ userName }) => {
    return (
        <div className="account-header">
            <div className="account-header-content">
                <div className="account-avatar">
                    <span className="avatar-icon">👤</span>
                </div>
                <div className="account-header-info">
                    <h1 className="account-title">Mi Cuenta</h1>
                    <p className="account-subtitle">Bienvenido, {userName}</p>
                </div>
            </div>
            <div className="account-header-decoration"></div>
        </div>
    );
};

export default AccountHeader;
