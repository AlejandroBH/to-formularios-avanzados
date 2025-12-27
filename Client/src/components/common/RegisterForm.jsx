import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const RegisterForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/user/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            setSuccess("¡Registro exitoso! Iniciando sesión...");

            login(response.data.user, response.data.accessToken, response.data.refreshToken);

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || "Error en el registro");
            } else {
                setError("Error de conexión con el servidor");
            }
        }
    };

    return (
        <div>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-input">
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Tu nombre completo"
                    />
                </div>
                <div className="login-input">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="tucorreo@email.com"
                    />
                </div>
                <div className="login-input">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Mínimo 6 caracteres"
                    />
                </div>
                <div className="login-input">
                    <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Repite tu contraseña"
                    />
                </div>
                <button className="login-button" type="submit">
                    Registrarse
                </button>
            </form>
            {error && <div className="login-message error">{error}</div>}
            {success && <div className="login-message success">{success}</div>}
        </div>
    );
};

export default RegisterForm;
