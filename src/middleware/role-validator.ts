import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar roles de usuario
 * Verifica si el usuario tiene al menos uno de los roles requeridos
 * @param roles Array de nombres de roles permitidos
 * @returns Middleware function
 */
export const validateRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Obtener usuario del request (previamente establecido por authenticate)
    const user = req.user;

    // Verificar que exista el usuario y tenga los roles requeridos
    if (!user || !user.roles || !user.roles.some((role: { name: string }) => roles.includes(role.name))) {
      res.status(401).json({ 
        error: `No autorizado. Esta función solo está disponible para el rol ${roles.join('- ')}` 
      });
      return;
    }

    next();
  };
};
