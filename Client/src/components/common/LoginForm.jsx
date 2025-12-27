import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { getRememberMe } from "../../utils/tokenManager";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedPreference = getRememberMe();
    setRememberMe(savedPreference);
  }, []);

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          errorMessage = "El email es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "El email no es válido";
        }
        break;

      case "password":
        if (!value) {
          errorMessage = "La contraseña es requerida";
        } else if (value.length < 6) {
          errorMessage = "La contraseña debe tener al menos 6 caracteres";
        }
        break;

      default:
        break;
    }

    return errorMessage;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (touched.email) {
      const errorMessage = validateField("email", value);
      setErrors({
        ...errors,
        email: errorMessage,
      });
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (touched.password) {
      const errorMessage = validateField("password", value);
      setErrors({
        ...errors,
        password: errorMessage,
      });
    }
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true,
    });

    const value = field === "email" ? email : password;
    const errorMessage = validateField(field, value);
    setErrors({
      ...errors,
      [field]: errorMessage,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setTouched({
      email: true,
      password: true,
    });

    const newErrors = {
      email: validateField("email", email),
      password: validateField("password", password),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) {
      setError("Por favor, corrige los errores en el formulario");
      return;
    }

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
            onChange={handleEmailChange}
            onBlur={() => handleBlur("email")}
            className={errors.email && touched.email ? "input-error" : ""}
          />
          {errors.email && touched.email && (
            <span className="field-error">{errors.email}</span>
          )}
        </div>
        <div className="login-input">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => handleBlur("password")}
            className={errors.password && touched.password ? "input-error" : ""}
          />
          {errors.password && touched.password && (
            <span className="field-error">{errors.password}</span>
          )}
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
