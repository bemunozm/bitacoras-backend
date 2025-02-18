import { users, roles, programs } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../config/db'

declare global {
    namespace Express {
        interface Request {
            user?: users & { roles: roles[], programs: programs[]}	
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) : Promise<void> =>  {
    const bearer = req.headers.authorization
    if(!bearer) {
        const error = new Error('No Autorizado')
        res.status(401).json({error: error.message})
        return
    }

    const [, token] = bearer.split(' ')
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if(typeof decoded === 'object' && decoded.id) {
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

                const roles = user.roles.map(role => role.roles)
                const programs = user.programs.map(program => program.program)

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
