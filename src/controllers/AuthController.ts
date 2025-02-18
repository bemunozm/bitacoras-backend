import type { Request, Response } from 'express';
import prisma from "../config/db"
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';
import {v2 as cloudinary } from 'cloudinary';

export class AuthController {

    static async createAccount(req: Request, res: Response): Promise<void> {
        try {
            const { password_confirmation, ...data } = req.body
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

            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al crear el usuario' })
            console.error(error)
        }
    }

    static async confirmAccount(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.body

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

            if (user.is_confirmed) {
                const error = new Error('El usuario ya esta confirmado')
                res.status(403).json({ error: error.message })
                return;
            }

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

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
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

            if (!user.is_confirmed) {
                const token = await prisma.tokens.create({
                    data: {
                        value: +generateToken(),
                        user_id: user.id,
                        expires_at: new Date(new Date().getTime() + 1000 * 60 * 60) // 1 hour
                    }
                })

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.value.toString()
                })

                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación')
                res.status(401).json({ error: error.message })
                return;
            }

            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error('Password Incorrecto')
                res.status(401).json({ error: error.message })
                return;
            }

            const token = generateJWT({ id: user.id })

            res.send(token)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static async requestConfirmationCode(req: Request, res: Response): Promise<void> {
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

            if (user.is_confirmed) {
                const error = new Error('El Usuario ya esta confirmado')
                res.status(403).json({ error: error.message })
                return;
            }

            const token = await prisma.tokens.create({
                data: {
                    value: +generateToken(),
                    user_id: user.id,
                    expires_at: new Date(new Date().getTime() + 1000 * 60 * 60)
                }
            })

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

            const token = await prisma.tokens.create({
                data: {
                    value: +generateToken(),
                    user_id: user.id,
                    expires_at: new Date(new Date().getTime() + 1000 * 60 * 60)
                }
            })

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

    static async validateToken(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.body

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

    static async updatePasswordWithToken(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.params
            const { password } = req.body

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

    static async user(req: Request, res: Response): Promise<void> {
        res.json(req.user)
    }

    static async updateProfile(req: Request, res: Response): Promise<void> {
        const { name, email, phone } = req.body
        
        console.log(req.file)

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

        req.user.name = name
        req.user.email = email
        req.user.phone = phone

        try {
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

               const updatedUser = await prisma.users.update({
                    where: {
                        id: req.user.id
                    },
                    data: {
                        profile_image: req.file ? req.file.path : null
                    }
                })

                req.user.profile_image = updatedUser.profile_image
            }
            res.send('Perfil actualizado correctamente')
        } catch (error) {
            res.status(500).send('Hubo un error')
        }
    }

    static async updateCurrentUserPassword(req: Request, res: Response): Promise<void> {
        const { current_password, password } = req.body

        console.log(req.user.id)
        console.log(req.body)

        const user = await prisma.users.findUnique({
            where: {
                id: req.user.id,
                is_replacement: false
            }
        })

        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña actual es incorrecta')
            res.status(401).json({ error: error.message })
            return;
        }

        try {
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

    static async checkPassword(req: Request, res: Response): Promise<void> {
        const { password } = req.body

        const user = await prisma.users.findUnique({
            where: {
                id: req.user.id
            }
        })

        const isPasswordCorrect = await checkPassword(password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña es incorrecta')
            res.status(401).json({ error: error.message })
            return;
        }

        res.send('Password Correcto')
    }
}