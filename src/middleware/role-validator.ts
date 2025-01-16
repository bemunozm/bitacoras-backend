import { Request, Response, NextFunction } from 'express';

export const validateRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !user.roles || !user.roles.some((role: { name: string }) => roles.includes(role.name))) {
      res.status(401).json({ error: `No autorizado. Esta función solo está disponible para el rol ${roles.join('- ')}` });
      return;
    }

    next();
  };
};
