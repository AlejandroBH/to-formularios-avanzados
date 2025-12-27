import { useAuth } from '../context/AuthContext';
import AccountHeader from '../components/common/AccountHeader';
import AccountInfo from '../components/common/AccountInfo';
import AccountSettings from '../components/common/AccountSettings';
import '../styles/account.css';

const AccountPage = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="account-page">
                <div className="loading-container">Cargando información del usuario...</div>
            </div>
        );
    }

    return (
        <div className="account-page">
            <div className="account-container">
                <AccountHeader userName={user.name} />

                <div className="account-content">
                    <AccountInfo user={user} />
                    <AccountSettings />
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
