import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Middleware para manejar errores de validación
 * Verifica los resultados de las validaciones de express-validator
 * @param req Request de Express
 * @param res Response de Express
 * @param next Función para continuar con el siguiente middleware
 * @returns Error 400 si hay errores de validación
 */
export const handleInputErrors = (req: Request, res: Response, next: NextFunction): void => {
    // Obtener errores de validación
    const errors = validationResult(req);

    // Si hay errores, retornar respuesta con error 400
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    next();
};
