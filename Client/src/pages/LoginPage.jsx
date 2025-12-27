import { Link } from "react-router-dom";
import LoginForm from "../components/common/LoginForm";
import "../styles/login.css";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Iniciar sesion</h1>
        <LoginForm />
        <div className="auth-link">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="auth-link-text">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
