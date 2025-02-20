import { users, roles, programs } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../config/db'

/**
 * Extensión de la interfaz Request de Express
 * Agrega la propiedad user con los datos del usuario autenticado
 * incluyendo sus roles y programas asociados
 */
declare global {
    namespace Express {
        interface Request {
            user?: users & { roles: roles[], programs: programs[]}	
        }
    }
}

/**
 * Middleware de autenticación
 * Verifica el token JWT en los headers y carga los datos del usuario
 * @param req Request de Express
 * @param res Response de Express
 * @param next Función para continuar con el siguiente middleware
 * @throws Error si no hay token o el token es inválido
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) : Promise<void> =>  {
    // Verificar existencia del token en headers
    const bearer = req.headers.authorization
    if(!bearer) {
        const error = new Error('No Autorizado')
        res.status(401).json({error: error.message})
        return
    }

    // Extraer el token del header Bearer
    const [, token] = bearer.split(' ')
    
    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if(typeof decoded === 'object' && decoded.id) {
            // Cargar datos completos del usuario incluyendo roles y programas
            const user = await prisma.users.findUnique({
                where: { id: decoded.id },
                include: {
                    roles: {
                        include: {
                            roles: true
                        }
                    },
                    programs: {
                        include: {
                            program: true
                        }
                    }
                }
            })

            if(user) {
                // Formatear roles y programas para mejor acceso
                const roles = user.roles.map(role => role.roles)
                const programs = user.programs.map(program => program.program)

                // Agregar usuario al request para uso en rutas posteriores
                req.user = {...user, roles, programs}
                next()
            } else {
                res.status(500).json({error: 'Token No Válido'})
            }
        }
    } catch (error) {
        res.status(500).json({error: 'Token No Válido'})
    }
}
