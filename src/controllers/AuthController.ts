import type { Request, Response } from 'express';
import prisma from "../config/db"
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';
import {v2 as cloudinary } from 'cloudinary';

/**
 * Controlador para manejar todas las operaciones de autenticación
 * Incluye registro, login, confirmación de cuenta, recuperación de contraseña y gestión de perfil
 */
export class AuthController {
    /**
     * Crea una nueva cuenta de usuario
     * @param req.body Datos del usuario (name,email, run, phone, password, etc)
     * @returns Mensaje de confirmación y envía email de verificación
     */
    static async createAccount(req: Request, res: Response): Promise<void> {
        try {
            const { password_confirmation, ...data } = req.body

            //Verifica que no exista un usuario con el mismo email o run
            const userExists = await prisma.users.findFirst({
                where: {
                    OR: [
                        { email: data.email },
                        { run: data.run }
                    ]
                }
            })

            if (userExists) {
                const error = new Error('El usuario ya existe')
                res.status(409).json({ error: error.message })
                return;
            }

            //Hashea la contraseña antes de guardarla
            const password = await hashPassword(req.body.password)

            //rol por defecto Usuario
            const role = await prisma.roles.findFirst({
                where: {
                    name: 'Usuario'
                }
            })  

            const user = await prisma.users.create({
                data: {
                    ...data,
                    password,
                    roles: {
                        createConnection: {
                            role_id: role.id
                        }
                    }
                }
            })

            //Genera un token de confirmación y lo guarda en la base de datos
            const token = await prisma.tokens.create({
                data: {
                    value: +generateToken(),
                    user_id: user.id,
                    expires_at: new Date(new Date().getTime() + 1000 * 60 * 60) // 1 hora
                }
            })

            //ENVIAR CORREO ELECTRONICO DE CONFIRMACION
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.value.toString()
            })

            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al crear el usuario' })
            console.error(error)
        }
    }

    /**
     * Confirma la cuenta de un usuario mediante un token
     * @param req.body.token Token de confirmación
     * @returns Mensaje de confirmación exitosa
     */
    static async confirmAccount(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.body

            //Verifica que el token sea válido y no haya expirado
            const tokenExists = await prisma.tokens.findFirst({
                where: {
                    value: +token,
                    expires_at: {
                        gt: new Date()
                    }
                }
            })

            if (!tokenExists) {
                const error = new Error('Token no válido')
                res.status(404).json({ error: error.message })
                return;
            }

            //Verifica que el usuario exista, no esté confirmado y no sea un usuario de reemplazo
            const user = await prisma.users.findUnique({
                where: {
                    id: tokenExists.user_id,
                    is_replacement: false
                }
            })

            if (!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({ error: error.message })
                return;
            }
            
            if (user.is_confirmed) {
                const error = new Error('El usuario ya esta confirmado')
                res.status(403).json({ error: error.message })
                return;
            }

            //Actualiza el estado de confirmación del usuario y elimina el token
            await prisma.users.update({
                where: {
                    id: user.id,
                    is_replacement: false
                },
                data: {
                    is_confirmed: true
                }
            })

            await prisma.tokens.delete({
                where: {
                    id: tokenExists.id
                }
            })

            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    /**
     * Autentica al usuario y genera un token JWT
     * @param req.body.email Email del usuario
     * @param req.body.password Contraseña del usuario
     * @returns Token JWT para autenticación
     */
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body

            //Busca al usuario por email y verifica que no sea un usuario de reemplazo
            const user = await prisma.users.findFirst({
                where: {
                    email,
                    is_replacement: false
                }
            })

            if (!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({ error: error.message })
                return;
            }

            //Verifica que la cuenta esté confirmada, si no lo está, envía un nuevo token
            if (!user.is_confirmed) {
                const token = await prisma.tokens.create({
                    data: {
                        value: +generateToken(),
                        user_id: user.id,
                        expires_at: new Date(new Date().getTime() + 1000 * 60 * 60) // 1 hour
                    }
                })

                //ENVIAR CORREO ELECTRONICO DE CONFIRMACION
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.value.toString()
                })

                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación')
                res.status(401).json({ error: error.message })
                return;
            }

            //Verifica que la contraseña sea correcta
            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error('Password Incorrecto')
                res.status(401).json({ error: error.message })
                return;
            }

            //Genera un token JWT y lo envía al cliente
            const token = generateJWT({ id: user.id })

            res.send(token)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    /**
     * Solicita un nuevo código de confirmación para una cuenta no confirmada
     * @param req.body.email Email del usuario
     * @returns Mensaje de envío de nuevo token
     */
    static async requestConfirmationCode(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body

            //Busca al usuario por email y verifica que no sea un usuario de reemplazo
            const user = await prisma.users.findFirst({
                where: {
                    email,
                    is_replacement: false
                }
            })
            if (!user) {
                const error = new Error('El Usuario no esta registrado')
                res.status(404).json({ error: error.message })
                return;
            }

            if (user.is_confirmed) {
                const error = new Error('El Usuario ya esta confirmado')
                res.status(403).json({ error: error.message })
                return;
            }

            //Genera un nuevo token de confirmación y lo guarda en la base de datos
            const token = await prisma.tokens.create({
                data: {
                    value: +generateToken(),
                    user_id: user.id,
                    expires_at: new Date(new Date().getTime() + 1000 * 60 * 60)
                }
            })

            //ENVIAR CORREO ELECTRONICO DE CONFIRMACION
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.value.toString()
            })

            res.send('Se envió un nuevo token a tu e-mail')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    /**
     * Inicia el proceso de recuperación de contraseña, enviando un token al email del usuario
     * @param req.body.email Email del usuario
     * @returns Mensaje de instrucciones enviadas
     */
    static async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body

            const user = await prisma.users.findFirst({
                where: {
                    email,
                    is_replacement: false
                }
            })
            if (!user) {
                const error = new Error('El Usuario no esta registrado')
                res.status(404).json({ error: error.message })
                return;
            }

            //Genera un nuevo token de recuperación y lo guarda en la base de datos
            const token = await prisma.tokens.create({
                data: {
                    value: +generateToken(),
                    user_id: user.id,
                    expires_at: new Date(new Date().getTime() + 1000 * 60 * 60)
                }
            })

            //ENVIAR CORREO ELECTRONICO DE RECUPERACION
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.value.toString()
            })
            res.send('Revisa tu email para instrucciones')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    /**
     * Valida un token de recuperación de contraseña
     * @param req.body.token Token a validar
     * @returns Confirmación de token válido
     */
    static async validateToken(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.body

            //Verifica que el token sea válido y no haya expirado
            const tokenExists = await prisma.tokens.findFirst({
                where: {
                    value: +token,
                    expires_at: {
                        gt: new Date()
                    }
                }
            })

            if (!tokenExists) {
                const error = new Error('Token no válido')
                res.status(404).json({ error: error.message })
                return;
            }
            res.send('Token válido, Define tu nuevo password')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    /**
     * Actualiza la contraseña usando un token de recuperación
     * @param req.params.token Token de recuperación
     * @param req.body.password Nueva contraseña
     * @returns Mensaje de actualización exitosa
     */
    static async updatePasswordWithToken(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.params
            const { password } = req.body

            //Verifica que el token sea válido y no haya expirado
            const tokenExists = await prisma.tokens.findFirst({
                where: {
                    value: +token,
                    expires_at: {
                        gt: new Date()
                    }
                }
            })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                res.status(404).json({ error: error.message })
                return;
            }

            const user = await prisma.users.findUnique({
                where: {
                    id: tokenExists.user_id,
                    is_replacement: false
                }
            })

            if (!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({ error: error.message })
                return;
            }

            //Hashea la nueva contraseña y actualiza el usuario
            const passwordHash = await hashPassword(password)

            await prisma.users.update({
                where: {
                    id: user.id,
                    is_replacement: false
                },
                data: {
                    password: passwordHash,
                    is_confirmed: true
                }
            })

            //Elimina el token de recuperacion de contraseña usado
            await prisma.tokens.delete({
                where: {
                    id: tokenExists.id
                }
            })

            res.send('La contraseña se modificó correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    /**
     * Obtiene la información del usuario actual autenticado
     * @returns Datos del usuario autenticado
     */
    static async user(req: Request, res: Response): Promise<void> {
        res.json(req.user)
    }

    /**
     * Actualiza el perfil del usuario incluyendo su imagen
     * @param req.body.name Nuevo nombre
     * @param req.body.email Nuevo email
     * @param req.body.phone Nuevo teléfono
     * @param req.file Imagen de perfil (opcional)
     * @returns Mensaje de actualización exitosa
     */
    static async updateProfile(req: Request, res: Response): Promise<void> {
        const { name, email, phone } = req.body
        
        //Verifica si el email ya está registrado por otro
        const userExists = await prisma.users.findFirst({
            where: {
                email,
                is_replacement: false
            }
        })
        if (userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error('Ese email ya esta registrado')
            res.status(409).json({ error: error.message })
            return;
        }

        //Actualiza los datos del usuario logueado
        req.user.name = name
        req.user.email = email
        req.user.phone = phone

        try {

            //Actualizar datos del usuario en la base de datos
            await prisma.users.update({
                where: {
                    id: req.user.id
                },
                data: {
                    name,
                    email,
                    phone
                }
            })

            //Actualizar imagen de perfil
            if (req.file) {

                //Si el usuario ya tiene una imagen de perfil, la eliminamos
                if (req.user.profile_image) {
                    cloudinary.uploader.destroy(req.user.profile_image.split('/').pop().split('.')[0]);
                }


                //Actualiza la imagen de perfil del usuario
               const updatedUser = await prisma.users.update({
                    where: {
                        id: req.user.id
                    },
                    data: {
                        profile_image: req.file ? req.file.path : null
                    }
                })

                //Actualiza la imagen de perfil en el objeto del usuario logueado
                req.user.profile_image = updatedUser.profile_image
            }
            res.send('Perfil actualizado correctamente')
        } catch (error) {
            res.status(500).send('Hubo un error')
        }
    }

    /**
     * Actualiza la contraseña del usuario autenticado
     * @param req.body.current_password Contraseña actual
     * @param req.body.password Nueva contraseña
     * @returns Mensaje de actualización exitosa
     */
    static async updateCurrentUserPassword(req: Request, res: Response): Promise<void> {
        const { current_password, password } = req.body

        //Verifica que el usuario no sea un usuario de reemplazo y existe
        const user = await prisma.users.findUnique({
            where: {
                id: req.user.id,
                is_replacement: false
            }
        })

        if (!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error: error.message })
            return;
        }

        //Verifica que la contraseña actual sea correcta
        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña actual es incorrecta')
            res.status(401).json({ error: error.message })
            return;
        }

        try {

            //Hashea la nueva contraseña y actualiza el usuario
            const passwordHash = await hashPassword(password)
            await prisma.users.update({
                where: {
                    id: req.user.id
                },
                data: {
                    password: passwordHash
                }
            })
            res.send('La contraseña se modificó correctamente')
        } catch (error) {
            res.status(500).send('Hubo un error')
        }
    }

    /**
     * Verifica si una contraseña coincide con la del usuario actual
     * @param req.body.password Contraseña a verificar
     * @returns Confirmación de contraseña correcta
     */
    static async checkPassword(req: Request, res: Response): Promise<void> {
        const { password } = req.body

        const user = await prisma.users.findUnique({
            where: {
                id: req.user.id
            }
        })

        if (!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error: error.message })
            return;
        }

        //Verifica que la contraseña sea correcta
        const isPasswordCorrect = await checkPassword(password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña es incorrecta')
            res.status(401).json({ error: error.message })
            return;
        }

        res.send('Password Correcto')
    }
}