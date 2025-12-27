import { useState, useEffect, useCallback, useMemo } from "react";
import { getFavoriteProducts, toggleFavorite } from "../services/api";
import ProductList from "../components/common/ProductList";
import "../styles/products.css";

const FavoritesPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchFavoriteProducts = async () => {
            try {
                const { data } = await getFavoriteProducts();
                setProducts(data);
            } catch (err) {
                setError("Error al cargar los productos favoritos", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteProducts();
    }, []);

    // Memoizar handleFavorite para evitar recrear la función en cada render
    const handleFavorite = useCallback(async (id) => {
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

    // Memoizar productos filtrados para optimizar búsqueda
    const filteredProducts = useMemo(() => {
        if (searchTerm === "") return products;

        return products.filter(product => {
            return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [products, searchTerm]);

    if (loading) return (
        <div className="products-page">
            <div className="loading-container">Cargando productos favoritos...</div>
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
                <h1 className="products-title">Mis Favoritos</h1>
            </div>

            {products.length === 0 ? (
                <div className="loading-container">
                    <p>No tienes productos favoritos aún.</p>
                    <p>¡Explora la <a href="/">página de productos</a> y marca tus favoritos!</p>
                </div>
            ) : (
                <>
                    <div className="filters-container">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="🔍 Buscar en favoritos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                    <ProductList products={filteredProducts} onFavorite={handleFavorite} />
                </>
            )}
        </div>
    );
};

export default FavoritesPage;

