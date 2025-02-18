import type { Request, Response } from 'express';
import prisma from '../config/db';
import { hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { v2 as cloudinary } from 'cloudinary';

export class UserController {

    static async createUser(req: Request, res: Response) {
    
        const { run, name, job_position, email, phone, roles } = req.body;
    
        try {
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await hashPassword(tempPassword);

            let rolesData = roles ? roles.map(role => ({
                role_id: +role
            })) : [];

            if (!roles) {
                const defaultRole = await prisma.roles.findFirst({
                    where: {
                        name: 'Usuario'
                    }
                });
                if (defaultRole) {
                    rolesData.push({ role_id: defaultRole.id });
                }
            }

            const userExists = await prisma.users.findFirst({
                where: {
                    OR: [
                        { email },
                        { run }
                    ]
                }
            });

            if (userExists) {
                res.status(400).json({ error: 'El usuario ya existe' });
                return;
            }
    
            const user = await prisma.users.create({
                data: {
                    run,
                    name,
                    job_position,
                    email,
                    phone,
                    password: hashedPassword,
                    profile_image: req.file ? req.file.path : null,
                    roles: {
                        createMany: {
                            data: rolesData
                        }
                    }
                }
            });
            
            if (!user) {
                res.status(400).json({ error: 'No se pudo crear el usuario' });
                return;
            }

            //Token de confirmación
            const token = await prisma.tokens.create({
                data: {
                    value: +generateToken(),
                    user_id: user.id,
                    expires_at: new Date(new Date().getTime() + 1000 * 60 * 60) // 1 hour
                }
            })

            //Enviar correo de bienvenida
            await AuthEmail.sendWelcomeEmail({email: user.email, name: user.name, token: token.value.toString()});
    
            res.send(`El usuario ${user.name} ha sido creado con éxito. La contraseña temporal es: ${tempPassword}`);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getUsers(req: Request, res: Response) {
        

        try {
            const users = await prisma.users.findMany({
                include: {
                    roles: {
                        include: {
                            roles: true
                        }
                    }
                }
            });

            const usersWithRoles = users.map(user => {
                return {
                    ...user,
                    roles: user.roles.map(role => role.roles)
                }
            });
            res.status(200).json(usersWithRoles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getUserById(req: Request, res: Response) {
        

        const { id } = req.params;

        try {
            const user = await prisma.users.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    roles: {
                        include: {
                            roles: true
                        }
                    }
                }
            });

            const userWithRoles = {
                ...user,
                roles: user.roles.map(role => role.roles)
            }

            res.status(200).json(userWithRoles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUser(req: Request, res: Response) {

        const { id } = req.params;
    
        try {
            const { run, name, job_position, email, phone, roles } = req.body;
            console.log(req.file)
    
            // Obtener roles actuales del usuario
            const currentRoles = await prisma.role_user.findMany({
                where: {
                    user_id: Number(id)
                }
            });

            //Comparar para ver si hay roles que eliminar
            const rolesToDelete = currentRoles.filter(currentRole => !roles.includes(currentRole.role_id));

            //Roles que agregar
            const rolesToAdd = roles.filter(role => !currentRoles.map(currentRole => currentRole.role_id).includes(role));

            

            //Eliminar roles que no estén en la lista de roles
            await prisma.role_user.deleteMany({
                where: {
                    user_id: Number(id),
                    role_id: {
                        in: rolesToDelete.map(role => role.role_id)
                    }
                }
            });

            const otherUserExists = await prisma.users.findFirst({
                where: {
                    OR: [
                        { email },
                        { run }
                    ],
                    id: {
                        not: Number(id)
                    }
                }
            });

            if (otherUserExists) {
                res.status(400).json({ error: 'Ya existe otro usuario con este email o rut' });
                return;
            }
    
            // Luego, actualizar el usuario con los nuevos roles
            await prisma.users.update({
                where: {
                    id: Number(id)
                },
                data: {
                    run,
                    name,
                    job_position,
                    email,
                    phone,
                    roles: {
                        createMany: {
                            data: rolesToAdd.map(role => ({
                                role_id: +role // Asociar los roles nuevos
                            }))
                        }
                    }
                }
            });

            //Comprobar si se subio una nueva imagen
            //Actualizar imagen de perfil
            if (req.file) {

                const currentUser = await prisma.users.findUnique({
                    where: {
                        id: +id
                    }
                });

                //Si el usuario ya tiene una imagen de perfil, la eliminamos
                if (currentUser.profile_image) {
                    await cloudinary.uploader.destroy(currentUser.profile_image.split('/').pop().split('.')[0]);

                }

                console.log(req.file.path)
                await prisma.users.update({
                    where: {
                        id: +id
                    },
                    data: {
                        profile_image: req.file ? req.file.path : null
                    }
                })
            }
    
            res.send(`El usuario ha sido actualizado con éxito`);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }    

    static async deleteUser(req: Request, res: Response) {

        const { id } = req.params;
    
        try {
            
            // Luego eliminar el usuario
            await prisma.users.delete({
                where: {
                    id: Number(id)
                }
            });
    
            res.send(`El usuario ha sido eliminado con éxito`);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCoordinators(req: Request, res: Response) {
        

        try {
            const coordinators = await prisma.users.findMany({
                where: {
                    roles: {
                        some: {
                            roles: {
                                name: 'Coordinador'
                            }
                        }
                    }
                }
            });

            console.log('Cordinadores',coordinators);

            res.status(200).json(coordinators);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    }

    static async createReplacement(req: Request, res: Response) {

        const { name, run, email, phone } = req.body;
    
        try {

            const userExists = await prisma.users.findFirst({
                where: {
                    OR: [
                        { email },
                        { run }
                    ]
                }
            });

            if (userExists) {
                res.status(400).json({ error: 'El usuario ya existe' });
                return;
            }

            const replacement = await prisma.users.create({
                data: {
                    name,
                    run,
                    email,
                    phone,
                    is_replacement: true
                }
            });

            if (!replacement) {
                res.status(400).json({ error: 'No se pudo crear el reemplazo' });
                return;
            }
    
            res.send(`El reemplazo ha sido creado con éxito`);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getReplacements(req: Request, res: Response) {

        try {
            const replacements = await prisma.users.findMany({
                where: {
                    is_replacement: true
                }
            });

            res.status(200).json(replacements);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getReplacement(req: Request, res: Response) {

        const { id } = req.params;

        try {
            const replacement = await prisma.users.findUnique({
                where: {
                    id: Number(id),
                    is_replacement: true
                }
            });

            if (!replacement) {
                res.status(404).json({ error: 'No se encontró el reemplazo' });
                return;
            }

            res.status(200).json(replacement);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateReplacement(req: Request, res: Response) {
            
            const { id } = req.params;
        
            try {
                const { name, run, email, phone } = req.body;
        
                const replacement = await prisma.users.update({
                    where: {
                        id: Number(id),
                        is_replacement: true
                    },
                    data: {
                        name,
                        run,
                        email,
                        phone
                    }
                });
        
                res.send(`El reemplazo ha sido actualizado con éxito`);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }   
}