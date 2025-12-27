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
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validateField = (name, value) => {
        let errorMessage = "";

        switch (name) {
            case "name":
                if (!value.trim()) {
                    errorMessage = "El nombre es requerido";
                } else if (value.trim().length < 3) {
                    errorMessage = "El nombre debe tener al menos 3 caracteres";
                }
                break;

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
                } else if (!/(?=.*[a-z])/.test(value)) {
                    errorMessage = "Debe contener al menos una letra minúscula";
                } else if (!/(?=.*[A-Z])/.test(value)) {
                    errorMessage = "Debe contener al menos una letra mayúscula";
                } else if (!/(?=.*\d)/.test(value)) {
                    errorMessage = "Debe contener al menos un número";
                }
                break;

            case "confirmPassword":
                if (!value) {
                    errorMessage = "Debes confirmar tu contraseña";
                } else if (value !== formData.password) {
                    errorMessage = "Las contraseñas no coinciden";
                }
                break;

            default:
                break;
        }

        return errorMessage;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (touched[name]) {
            const errorMessage = validateField(name, value);
            setErrors({
                ...errors,
                [name]: errorMessage,
            });
        }

        if (name === "password" && touched.confirmPassword) {
            const confirmError = formData.confirmPassword !== value
                ? "Las contraseñas no coinciden"
                : "";
            setErrors({
                ...errors,
                password: validateField(name, value),
                confirmPassword: confirmError,
            });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched({
            ...touched,
            [name]: true,
        });

        const errorMessage = validateField(name, value);
        setErrors({
            ...errors,
            [name]: errorMessage,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
        });

        const newErrors = {
            name: validateField("name", formData.name),
            email: validateField("email", formData.email),
            password: validateField("password", formData.password),
            confirmPassword: validateField("confirmPassword", formData.confirmPassword),
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== "");
        if (hasErrors) {
            setError("Por favor, corrige los errores en el formulario");
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
                        onBlur={handleBlur}
                        className={errors.name && touched.name ? "input-error" : ""}
                        placeholder="Tu nombre completo"
                    />
                    {errors.name && touched.name && (
                        <span className="field-error">{errors.name}</span>
                    )}
                </div>
                <div className="login-input">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.email && touched.email ? "input-error" : ""}
                        placeholder="tucorreo@email.com"
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.password && touched.password ? "input-error" : ""}
                        placeholder="Mínimo 6 caracteres"
                    />
                    {errors.password && touched.password && (
                        <span className="field-error">{errors.password}</span>
                    )}
                </div>
                <div className="login-input">
                    <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.confirmPassword && touched.confirmPassword ? "input-error" : ""}
                        placeholder="Repite tu contraseña"
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                        <span className="field-error">{errors.confirmPassword}</span>
                    )}
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
