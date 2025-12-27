import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { getRememberMe } from "../../utils/tokenManager";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedPreference = getRememberMe();
    setRememberMe(savedPreference);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email,
        password,
      });

      setSuccess("Login exitoso! espere un momento");

      login(response.data.user, response.data.accessToken, response.data.refreshToken, rememberMe);


      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Error en el login");
      } else {
        setError("Error de conexión");
      }
    }
  };

  return (
    <div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-input">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-input">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="remember-me-container">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe" className="remember-me-label">
            Recordar sesión
          </label>
        </div>
        <button className="login-button" type="submit">
          Iniciar Sesión
        </button>
      </form>
      {error && <div className="login-message error">{error}</div>}
      {success && <div className="login-message success">{success}</div>}
    </div>
  );
};

export default LoginForm;
