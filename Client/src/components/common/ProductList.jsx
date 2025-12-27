import { memo } from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, onFavorite }) => {
    return (
        <div className="products-container">
            {products.length === 0 ? (
                <div className="loading-container">
                    <p>No hay productos disponibles.</p>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onFavorite={onFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Memoizar el componente para prevenir re-renders cuando las props no cambien
export default memo(ProductList);

