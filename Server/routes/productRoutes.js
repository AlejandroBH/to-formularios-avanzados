import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    favoriteProduct,
    getFavoriteProducts,
} from "../controllers/productController.js";
import {
    createProductValidator,
    updateProductValidator,
    idParamValidator,
} from "../middlewares/productValidator.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const productRouter = Router();

// Rutas para productos
productRouter.get("/", getAllProducts);
productRouter.get("/favorites", authenticateToken, getFavoriteProducts);
productRouter.get("/:id", idParamValidator, getProductById);
productRouter.post("/", authenticateToken, createProductValidator, createProduct);
productRouter.put("/:id", authenticateToken, updateProductValidator, updateProduct);
productRouter.delete("/:id", authenticateToken, idParamValidator, deleteProduct);
productRouter.patch("/:id/favorite", authenticateToken, idParamValidator, favoriteProduct);

export default productRouter;
