import { Link } from "react-router-dom";
import RegisterForm from "../components/common/RegisterForm";
import "../styles/login.css";

const RegisterPage = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">Crear Cuenta</h1>
                <RegisterForm />
                <div className="auth-link">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="auth-link-text">
                        Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
