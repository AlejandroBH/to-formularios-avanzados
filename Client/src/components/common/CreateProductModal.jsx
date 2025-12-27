import { useState } from "react";
import { createProduct } from "../../services/api";

const CreateProductModal = ({ isOpen, onClose, onProductCreated }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                category: formData.category,
            };

            const response = await createProduct(productData);
            onProductCreated(response.data);
            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
                category: "",
            });
            onClose();
        } catch (err) {
            if (err.response && err.response.data.errors) {
                setErrors(err.response.data.errors.map((e) => e.msg));
            } else {
                setErrors(["Error al crear el producto. Por favor, intenta nuevamente."]);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Crear Nuevo Producto</h2>
                    <button className="close-button" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {errors.length > 0 && (
                    <div className="error-messages">
                        {errors.map((error, index) => (
                            <p key={index} className="error-message">
                                {error}
                            </p>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-group">
                        <label htmlFor="name">Nombre del Producto</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Laptop HP Pavilion"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe el producto..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Precio ($)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="99.99"
                                step="0.01"
                                min="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="stock">Stock</label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="10"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Categoría</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            <option value="Electrónica">Electrónica</option>
                            <option value="Accesorios">Accesorios</option>
                            <option value="Computadoras">Computadoras</option>
                            <option value="Periféricos">Periféricos</option>
                            <option value="Audio">Audio</option>
                            <option value="Video">Video</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? "Creando..." : "Crear Producto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProductModal;
