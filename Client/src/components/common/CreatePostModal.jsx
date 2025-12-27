import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/createPostModal.css";

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const getAuthorName = () => {
        return user?.name || "Usuario Anónimo";
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        if (!formData.title.trim() || !formData.content.trim()) {
            setError("Por favor, completa todos los campos");
            setIsSubmitting(false);
            return;
        }

        try {
            const authorName = getAuthorName();

            if (!authorName || authorName === "Usuario Anónimo") {
                setError("No se pudo obtener tu información de usuario. Por favor, vuelve a iniciar sesión.");
                setIsSubmitting(false);
                setTimeout(() => {
                    logout();
                    navigate("/login");
                }, 2000);
                return;
            }

            const response = await api.post("/posts", {
                title: formData.title,
                content: formData.content,
                author: authorName,
            });

            setFormData({ title: "", content: "" });

            if (onPostCreated) {
                onPostCreated(response.data);
            }

            onClose();
        } catch (err) {
            console.error("Error al crear post:", err);
            if (err.response && err.response.status === 401) {
                setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                logout();
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else if (err.response && err.response.status === 400) {
                const errorMsg = err.response.data?.errors
                    ? err.response.data.errors.map(e => e.msg).join(", ")
                    : err.response.data?.error || "Error de validación";
                setError(errorMsg);
            } else {
                setError(err.response?.data?.error || "Error al crear el post");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({ title: "", content: "" });
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">✨ Crear Nuevo Post</h2>
                    <button className="modal-close" onClick={handleClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-user-info">
                    Publicando como: <strong>{getAuthorName()}</strong>
                </div>

                <form onSubmit={handleSubmit} className="create-post-form">
                    <div className="form-group">
                        <label htmlFor="title">Título</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Escribe un título atractivo..."
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Contenido</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Comparte tus ideas..."
                            rows="6"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <span className="submit-icon">🚀</span>
                                    Publicar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
