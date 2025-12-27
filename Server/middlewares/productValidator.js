import { body, param, validationResult } from "express-validator";

// Validador para crear un producto
export const createProductValidator = [
    body("name")
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .isString()
        .withMessage("El nombre debe ser un texto")
        .isLength({ min: 3, max: 100 })
        .withMessage("El nombre debe tener entre 3 y 100 caracteres"),
    body("description")
        .notEmpty()
        .withMessage("La descripción es obligatoria")
        .isString()
        .withMessage("La descripción debe ser un texto")
        .isLength({ min: 10 })
        .withMessage("La descripción debe tener al menos 10 caracteres"),
    body("price")
        .notEmpty()
        .withMessage("El precio es obligatorio")
        .isFloat({ min: 0.01 })
        .withMessage("El precio debe ser un número mayor a 0"),
    body("stock")
        .notEmpty()
        .withMessage("El stock es obligatorio")
        .isInt({ min: 0 })
        .withMessage("El stock debe ser un número entero no negativo"),
    body("category")
        .notEmpty()
        .withMessage("La categoría es obligatoria")
        .isString()
        .withMessage("La categoría debe ser un texto"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Validador para actualizar un producto
export const updateProductValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
    body("name")
        .optional()
        .isString()
        .withMessage("El nombre debe ser un texto")
        .isLength({ min: 3, max: 100 })
        .withMessage("El nombre debe tener entre 3 y 100 caracteres"),
    body("description")
        .optional()
        .isString()
        .withMessage("La descripción debe ser un texto")
        .isLength({ min: 10 })
        .withMessage("La descripción debe tener al menos 10 caracteres"),
    body("price")
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage("El precio debe ser un número mayor a 0"),
    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("El stock debe ser un número entero no negativo"),
    body("category")
        .optional()
        .isString()
        .withMessage("La categoría debe ser un texto"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Validador para parámetros de ID
export const idParamValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
