import { useState, useEffect, useCallback, useMemo } from "react";
import { getProducts, toggleFavorite } from "../services/api";
import ProductList from "../components/common/ProductList";
import CreateProductModal from "../components/common/CreateProductModal";
import "../styles/products.css";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await getProducts();
                setProducts(data);
            } catch (err) {
                setError("Error al cargar los productos", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    // Memoizar handleFavorite para evitar recrear la función en cada render
    const handleFavorite = useCallback(async (id) => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Debes iniciar sesión para marcar productos como favoritos');
            window.location.href = '/login';
            return;
        }

        try {
            const response = await toggleFavorite(id);
            setProducts(products.map((product) => (product.id === id ? response.data : product)));
        } catch (err) {
            console.error("Error al marcar como favorito:", err);
            if (err.response && err.response.status === 401) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
    }, [products]);

    // Memoizar handleCreateProduct
    const handleCreateProduct = useCallback(() => {
        if (!isLoggedIn) {
            alert('Debes iniciar sesión para crear un nuevo producto');
            window.location.href = '/login';
            return;
        }

        setIsModalOpen(true);
    }, [isLoggedIn]);

    // Memoizar handleProductCreated
    const handleProductCreated = useCallback((newProduct) => {
        setProducts([newProduct, ...products]);
    }, [products]);

    // Extraer categorías únicas de los productos
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        return uniqueCategories.sort();
    }, [products]);

    // Memoizar productos filtrados para optimizar cálculos de filtrado y búsqueda
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = searchTerm === "" ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === "" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    if (loading) return (
        <div className="products-page">
            <div className="loading-container">Cargando productos...</div>
        </div>
    );

    if (error) return (
        <div className="products-page">
            <div className="error-container">{error}</div>
        </div>
    );

    return (
        <div className="products-page">
            <div className="products-header">
                <h1 className="products-title">Productos</h1>
                <button
                    className={`create-product-button ${!isLoggedIn ? 'disabled' : ''}`}
                    onClick={handleCreateProduct}
                    disabled={!isLoggedIn}
                    title={!isLoggedIn ? 'Debes iniciar sesión para crear un producto' : 'Crear nuevo producto'}
                >
                    <span className="button-icon">✨</span>
                    <span className="button-text">Crear Nuevo Producto</span>
                </button>
            </div>

            <div className="filters-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="category-filter">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-select"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <ProductList products={filteredProducts} onFavorite={handleFavorite} />

            <CreateProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProductCreated={handleProductCreated}
            />
        </div>
    );
};

export default ProductsPage;

