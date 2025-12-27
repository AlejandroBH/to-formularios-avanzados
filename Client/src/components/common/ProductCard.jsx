import { memo, useMemo } from "react";

const ProductCard = ({ product, onFavorite }) => {
    const formattedDate = useMemo(() => {
        return new Date(product.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }, [product.createdAt]);

    return (
        <div className="product-card">
            <div className="product-header">
                <h3 className="product-name">{product.name}</h3>
                <span className="product-category">{product.category}</span>
            </div>
            <p className="product-description">{product.description}</p>
            <div className="product-details">
                <div className="product-price">
                    <span className="price-label">Precio:</span>
                    <span className="price-value">${product.price.toFixed(2)}</span>
                </div>
                <div className="product-stock">
                    <span className="stock-label">Stock:</span>
                    <span className={`stock-value ${product.stock < 10 ? 'low-stock' : ''}`}>
                        {product.stock} unidades
                    </span>
                </div>
            </div>
            <div className="product-footer">
                <span className="product-date">{formattedDate}</span>
                <div className="product-actions">
                    <span className="favorite-count">❤️ {product.favorites}</span>
                    <button
                        className="favorite-button"
                        onClick={() => onFavorite(product.id)}
                    >
                        Favorito
                    </button>
                </div>
            </div>
        </div>
    );
};

// Memoizar el componente para prevenir re-renders innecesarios
export default memo(ProductCard);
