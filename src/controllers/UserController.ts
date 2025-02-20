import type { Request, Response } from 'express';
import prisma from '../config/db';
import { hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Controlador para manejar todas las operaciones relacionadas con usuarios
 * Incluye gestión de usuarios regulares y reemplazos
 */
export class UserController {
    /**
     * Crea un nuevo usuario con roles asignados
     * @param req.body.run RUN del usuario
     * @param req.body.name Nombre del usuario
     * @param req.body.job_position Cargo del usuario
     * @param req.body.email Email del usuario
     * @param req.body.phone Teléfono del usuario
     * @param req.body.roles Array de IDs de roles
     * @param req.file Imagen de perfil (opcional)
     * @returns Mensaje de confirmación y contraseña temporal
     */
    static async createUser(req: Request, res: Response) {
    
        const { run, name, job_position, email, phone, roles } = req.body;
    
        try {
            
            // Generar contraseña temporal y hashearla
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await hashPassword(tempPassword);

            // Obtener roles a partir de los IDs
            let rolesData = roles ? roles.map(role => ({
                role_id: +role
            })) : [];

            // Si no se especifican roles, asignar el rol de Usuario por defecto
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

            // Verificar si el usuario ya existe
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
            
            // Crear el usuario con los roles asociados
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

    /**
     * Obtiene todos los usuarios con sus roles
     * @returns Lista de usuarios con sus roles asociados
     */
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

            // Mapear los roles de cada usuario para evitar la informacion de la tabla pivote
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

    /**
     * Obtiene un usuario específico por su ID
     * @param req.params.id ID del usuario
     * @returns Detalles del usuario con sus roles
     */
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

            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }

            // Mapear los roles de cada usuario para evitar la informacion de la tabla pivote
            const userWithRoles = {
                ...user,
                roles: user.roles.map(role => role.roles)
            }

            res.status(200).json(userWithRoles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Actualiza los datos de un usuario existente
     * @param req.params.id ID del usuario
     * @param req.body Datos actualizados del usuario
     * @param req.file Nueva imagen de perfil (opcional)
     * @returns Mensaje de confirmación de actualización
     */
    static async updateUser(req: Request, res: Response) {

        const { id } = req.params;
    
        try {
            const { run, name, job_position, email, phone, roles } = req.body;
    
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

            // Verificar si hay otro usuario con el mismo email o RUN
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

    /**
     * Elimina un usuario del sistema
     * @param req.params.id ID del usuario
     * @returns Mensaje de confirmación de eliminación
     */
    static async deleteUser(req: Request, res: Response) {

        const { id } = req.params;
    
        try {

            // Verificar que el usuario exista
            const user = await prisma.users.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }

            // Verificar si el usuario es un reemplazo para eliminar todos los datos asociados
            if (user.is_replacement) {
                //Eliminar todos los datos asociados y luego el usuario
                await prisma.tokens.deleteMany({
                    where: {
                        user_id: Number(id)
                    }
                });

                await prisma.role_user.deleteMany({
                    where: {
                        user_id: Number(id)
                    }
                });

                await prisma.program_user.deleteMany({
                    where: {
                        user_id: Number(id)
                    }
                });

                const bitacoras = await prisma.bitacoras.findMany({
                    where: {
                        user_id: Number(id)
                    }
                });

                for (const bitacora of bitacoras) {
                    await prisma.activities.deleteMany({
                        where: {
                            bitacora_id: bitacora.id
                        }
                    });
                }

                await prisma.bitacoras.deleteMany({
                    where: {
                        user_id: Number(id)
                    }
                });

                await prisma.users.delete({
                    where: {
                        id: Number(id)
                    }
                });

                res.send(`El remplazo ha sido eliminado con
                éxito`);
                return;
            }

            //Si el usuario no es un reemplazo, eliminar los roles asociados primero deberan eliminar todos los datos asociados de manera manual

            // Verificar que no tenga bitácoras asociadas
            const bitacoras = await prisma.bitacoras.findMany({
                where: {
                    user_id: Number(id)
                }
            });

            if (bitacoras.length > 0) {
                res.status(400).json({ error: 'No se puede eliminar el usuario porque tiene bitácoras asociadas' });
                return;
            }
 
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

    /**
     * Obtiene todos los usuarios con rol de Coordinador
     * @returns Lista de coordinadores
     */
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

            res.status(200).json(coordinators);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Crea un nuevo usuario de reemplazo
     * @param req.body.name Nombre del reemplazo
     * @param req.body.run RUN del reemplazo
     * @param req.body.email Email del reemplazo
     * @param req.body.phone Teléfono del reemplazo
     * @returns Mensaje de confirmación de creación
     */
    static async createReplacement(req: Request, res: Response) {

        const { name, run, email, phone } = req.body;
    
        try {

            // Verificar si el usuario ya existe
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

    /**
     * Obtiene todos los usuarios de reemplazo
     * @returns Lista de usuarios de reemplazo
     */
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

    /**
     * Obtiene un usuario de reemplazo específico
     * @param req.params.id ID del reemplazo
     * @returns Detalles del usuario de reemplazo
     */
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

    /**
     * Actualiza los datos de un usuario de reemplazo
     * @param req.params.id ID del reemplazo
     * @param req.body Datos actualizados del reemplazo
     * @returns Mensaje de confirmación de actualización
     */
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