import * as productService from "../services/productService.js";

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
    try {
        const products = productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = productService.getProductById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const data = req.body;
        const newProduct = productService.createProduct(data);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedProduct = productService.updateProduct(id, data);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = productService.deleteProduct(id);
        res.status(200).json({ message: "Producto eliminado exitosamente", product: deletedProduct });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Marcar producto como favorito
export const favoriteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const product = productService.favoriteProduct(id, userId);
        res.status(200).json(product);
    } catch (error) {
        if (error.message === "Ya has marcado este producto como favorito") {
            return res.status(400).json({ error: error.message });
        }
        res.status(404).json({ error: error.message });
    }
};

// Obtener productos favoritos del usuario autenticado
export const getFavoriteProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const favoriteProducts = productService.getFavoriteProducts(userId);
        res.status(200).json(favoriteProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
