import { products } from "../data/products.js";

// Obtener todos los productos
export const getAllProducts = () => {
    return products;
};

// Obtener un producto por ID
export const getProductById = (id) => {
    const product = products.find((p) => p.id === parseInt(id));
    if (!product) {
        throw new Error("Producto no encontrado");
    }
    return product;
};

// Crear un nuevo producto
export const createProduct = (productData) => {
    const newProduct = {
        id: Date.now(),
        ...productData,
        createdAt: new Date(),
        favorites: 0,
        favoritedBy: [],
    };
    products.push(newProduct);
    return newProduct;
};

// Actualizar un producto
export const updateProduct = (id, productData) => {
    const productIndex = products.findIndex((p) => p.id === parseInt(id));
    if (productIndex === -1) {
        throw new Error("Producto no encontrado");
    }

    products[productIndex] = {
        ...products[productIndex],
        ...productData,
        id: products[productIndex].id,
        createdAt: products[productIndex].createdAt,
        favorites: products[productIndex].favorites,
    };

    return products[productIndex];
};

// Eliminar un producto
export const deleteProduct = (id) => {
    const productIndex = products.findIndex((p) => p.id === parseInt(id));
    if (productIndex === -1) {
        throw new Error("Producto no encontrado");
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    return deletedProduct;
};

// Marcar producto como favorito
export const favoriteProduct = (id, userId) => {
    const product = products.find((p) => p.id === parseInt(id));
    if (!product) {
        throw new Error("Producto no encontrado");
    }

    if (product.favoritedBy.includes(userId)) {
        throw new Error("Ya has marcado este producto como favorito");
    }

    product.favoritedBy.push(userId);
    product.favorites += 1;
    return product;
};

// Obtener productos favoritos de un usuario
export const getFavoriteProducts = (userId) => {
    return products.filter((product) => product.favoritedBy.includes(userId));
};
