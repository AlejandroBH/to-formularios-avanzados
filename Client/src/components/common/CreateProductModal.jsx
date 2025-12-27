import { useState } from "react";
import { createProduct } from "../../services/api";
import { compressImage, validateImageFile } from "../../utils/imageCompression";

const CreateProductModal = ({ isOpen, onClose, onProductCreated }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: "",
    });
    const [touched, setTouched] = useState({
        name: false,
        description: false,
        price: false,
        stock: false,
        category: false,
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [compressing, setCompressing] = useState(false);

    const validateField = (name, value) => {
        let errorMessage = "";

        switch (name) {
            case "name":
                if (!value.trim()) {
                    errorMessage = "El nombre del producto es requerido";
                } else if (value.trim().length < 3) {
                    errorMessage = "El nombre debe tener al menos 3 caracteres";
                } else if (value.trim().length > 100) {
                    errorMessage = "El nombre no puede exceder 100 caracteres";
                }
                break;

            case "description":
                if (!value.trim()) {
                    errorMessage = "La descripción es requerida";
                } else if (value.trim().length < 10) {
                    errorMessage = "La descripción debe tener al menos 10 caracteres";
                } else if (value.trim().length > 500) {
                    errorMessage = "La descripción no puede exceder 500 caracteres";
                }
                break;

            case "price":
                if (!value) {
                    errorMessage = "El precio es requerido";
                } else if (isNaN(value) || parseFloat(value) <= 0) {
                    errorMessage = "El precio debe ser un número mayor a 0";
                } else if (parseFloat(value) > 1000000) {
                    errorMessage = "El precio no puede exceder $1,000,000";
                }
                break;

            case "stock":
                if (!value && value !== "0") {
                    errorMessage = "El stock es requerido";
                } else if (isNaN(value) || parseInt(value) < 0) {
                    errorMessage = "El stock debe ser un número mayor o igual a 0";
                } else if (!Number.isInteger(parseFloat(value))) {
                    errorMessage = "El stock debe ser un número entero";
                } else if (parseInt(value) > 100000) {
                    errorMessage = "El stock no puede exceder 100,000 unidades";
                }
                break;

            case "category":
                if (!value) {
                    errorMessage = "Debes seleccionar una categoría";
                }
                break;

            default:
                break;
        }

        return errorMessage;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (touched[name]) {
            const errorMessage = validateField(name, value);
            setFieldErrors({
                ...fieldErrors,
                [name]: errorMessage,
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
        setFieldErrors({
            ...fieldErrors,
            [name]: errorMessage,
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            setImage(null);
            setImagePreview(null);
            setFieldErrors({ ...fieldErrors, image: "" });
            return;
        }

        const validation = validateImageFile(file);
        if (!validation.isValid) {
            setFieldErrors({
                ...fieldErrors,
                image: validation.error
            });
            setImage(null);
            setImagePreview(null);
            e.target.value = '';
            return;
        }

        try {
            setCompressing(true);
            setFieldErrors({ ...fieldErrors, image: "" });

            const compressedFile = await compressImage(file);

            setImage(compressedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(compressedFile);
        } catch (error) {
            console.error('Error al procesar la imagen:', error);
            setFieldErrors({
                ...fieldErrors,
                image: "Error al procesar la imagen. Por favor, intenta con otra."
            });
            setImage(null);
            setImagePreview(null);
            e.target.value = '';
        } finally {
            setCompressing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        setTouched({
            name: true,
            description: true,
            price: true,
            stock: true,
            category: true,
        });

        const newErrors = {
            name: validateField("name", formData.name),
            description: validateField("description", formData.description),
            price: validateField("price", formData.price),
            stock: validateField("stock", formData.stock),
            category: validateField("category", formData.category),
        };

        setFieldErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== "");
        if (hasErrors) {
            setErrors(["Por favor, corrige los errores en el formulario"]);
            setLoading(false);
            return;
        }

        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                category: formData.category,
                image: image,
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
            setImage(null);
            setImagePreview(null);
            setFieldErrors({
                name: "",
                description: "",
                price: "",
                stock: "",
                category: "",
                image: "",
            });
            setTouched({
                name: false,
                description: false,
                price: false,
                stock: false,
                category: false,
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
                            onBlur={handleBlur}
                            className={fieldErrors.name && touched.name ? "input-error" : ""}
                            placeholder="Ej: Laptop HP Pavilion"
                        />
                        {fieldErrors.name && touched.name && (
                            <span className="field-error">{fieldErrors.name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={fieldErrors.description && touched.description ? "input-error" : ""}
                            placeholder="Describe el producto..."
                            rows="4"
                        />
                        {fieldErrors.description && touched.description && (
                            <span className="field-error">{fieldErrors.description}</span>
                        )}
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
                                onBlur={handleBlur}
                                className={fieldErrors.price && touched.price ? "input-error" : ""}
                                placeholder="99.99"
                                step="0.01"
                                min="0.01"
                            />
                            {fieldErrors.price && touched.price && (
                                <span className="field-error">{fieldErrors.price}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="stock">Stock</label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={fieldErrors.stock && touched.stock ? "input-error" : ""}
                                placeholder="10"
                                min="0"
                            />
                            {fieldErrors.stock && touched.stock && (
                                <span className="field-error">{fieldErrors.stock}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Categoría</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={fieldErrors.category && touched.category ? "input-error" : ""}
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
                        {fieldErrors.category && touched.category && (
                            <span className="field-error">{fieldErrors.category}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Imagen del Producto (Opcional)</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleImageChange}
                            className={fieldErrors.image ? "input-error" : ""}
                            disabled={compressing}
                        />
                        {compressing && (
                            <span className="field-info">⏳ Comprimiendo imagen...</span>
                        )}
                        {fieldErrors.image && (
                            <span className="field-error">{fieldErrors.image}</span>
                        )}
                        {imagePreview && !compressing && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        )}
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
                            disabled={loading || compressing}
                        >
                            {loading ? "Creando..." : (compressing ? "Comprimiendo..." : "Crear Producto")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProductModal;
