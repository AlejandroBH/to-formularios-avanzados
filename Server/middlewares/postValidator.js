import { body, param, validationResult } from "express-validator";

// Validador para crear un post
export const createPostValidator = [
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isString()
    .withMessage("El título debe ser un texto")
    .isLength({ min: 3, max: 200 })
    .withMessage("El título debe tener entre 3 y 200 caracteres"),
  body("content")
    .notEmpty()
    .withMessage("El contenido es obligatorio")
    .isString()
    .withMessage("El contenido debe ser un texto")
    .isLength({ min: 10 })
    .withMessage("El contenido debe tener al menos 10 caracteres"),
  body("author")
    .notEmpty()
    .withMessage("El autor es obligatorio")
    .isString()
    .withMessage("El autor debe ser un texto"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validador para actualizar un post
export const updatePostValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo"),
  body("title")
    .optional()
    .isString()
    .withMessage("El título debe ser un texto")
    .isLength({ min: 3, max: 200 })
    .withMessage("El título debe tener entre 3 y 200 caracteres"),
  body("content")
    .optional()
    .isString()
    .withMessage("El contenido debe ser un texto")
    .isLength({ min: 10 })
    .withMessage("El contenido debe tener al menos 10 caracteres"),
  body("author")
    .optional()
    .isString()
    .withMessage("El autor debe ser un texto"),
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
