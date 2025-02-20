import type { Request, Response } from "express";
import prisma from "../config/db";

/**
 * Controlador para manejar todas las operaciones relacionadas con programas
 * Incluye la gestión de programas y sus asociaciones con usuarios y coordinadores
 */
export class ProgramController {
    /**
     * Crea un nuevo programa y asigna su coordinador
     * @param req.body.name Nombre del programa
     * @param req.body.company Empresa asociada
     * @param req.body.address Dirección del programa
     * @param req.body.state Estado/región del programa
     * @param req.body.coordinator_id ID del usuario que será coordinador
     * @returns Mensaje de confirmación de creación
     * @throws Error si el coordinador no existe o no tiene el rol adecuado
     */
    static async createProgram(req: Request, res: Response) {
        const { name, company, address, state, coordinator_id } = req.body;

        try {
            //Verifica que el usuario exista y tenga el rol de Coordinador
            const coordinatorExists = await prisma.users.findFirst({
                where: { id: coordinator_id },
                include: {
                    roles: {
                        include: {
                            roles: true,
                        },
                    },
                },
            });

            if (
                !coordinatorExists ||
                !coordinatorExists.roles.some(
                    (role) => role.roles.name === "Coordinador"
                )
            ) {
                res.status(400).json({
                    error: "El coordinador no existe o no tiene el rol de Coordinador",
                });
                return;
            }

            //Verifica que no exista un programa con el mismo nombre, empresa, dirección y estado
            const programExists = await prisma.programs.findFirst({
                where: { name, company, address, state },
            });

            if (programExists) {
                res.status(400).json({ error: "El programa ya existe" });
                return;
            }

            //Crear el programa
            await prisma.programs.create({
                data: {
                    name,
                    company,
                    address,
                    state,
                    users: {
                        create: {
                            user_id: coordinator_id,
                            is_coordinator: true,
                            turn: null,
                        },
                    },
                },
            });

            res.send("Programa creado correctamente");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Obtiene todos los programas con sus usuarios asociados
     * @returns Lista de programas incluyendo:
     * - Usuarios asociados con sus datos
     * - Información del coordinador
     */
    static async getPrograms(req: Request, res: Response) {
        try {
            const programs = await prisma.programs.findMany({
                include: {
                    users: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            res.status(200).json(programs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Obtiene un programa específico por su ID
     * @param req.params.id ID del programa
     * @returns Detalles del programa y sus usuarios asociados
     */
    static async getProgram(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const program = await prisma.programs.findUnique({
                where: { id: parseInt(id) },
                include: {
                    users: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            if (!program) {
                res.status(404).json({ error: "Programa no encontrado" });
                return;
            }

            res.status(200).json(program);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Actualiza los datos de un programa y su coordinador
     * @param req.params.id ID del programa
     * @param req.body.name Nuevo nombre
     * @param req.body.company Nueva empresa
     * @param req.body.address Nueva dirección
     * @param req.body.state Nuevo estado/región
     * @param req.body.coordinator_id ID del nuevo coordinador
     * @returns Mensaje de confirmación de actualización
     * @throws Error si el nuevo coordinador no tiene el rol adecuado
     */
    static async updateProgram(req: Request, res: Response) {
        const { id } = req.params;
        const { name, company, address, state, coordinator_id } = req.body;

        try {
            // Validar coordinador y sus roles
            const coordinatorExists = await prisma.users.findFirst({
                where: { id: coordinator_id },
                include: {
                    roles: {
                        include: {
                            roles: true,
                        },
                    },
                },
            });

            if (!coordinatorExists || !coordinatorExists.roles.some((role) => role.roles.name === "Coordinador")) {
                res.status(400).json({
                    error: "El coordinador no existe o no tiene el rol de Coordinador",
                });
                return;
            }

            // Verificar duplicados excluyendo el programa actual
            const programExists = await prisma.programs.findFirst({
                where: { 
                    name, 
                    company, 
                    address, 
                    state, 
                    id: { not: Number(id) } 
                },
            });

            if (programExists) {
                res.status(400).json({ error: "El programa ya existe" });
                return;
            }

            // Actualizar programa y reasignar coordinador
            await prisma.programs.update({
                where: { id: Number(id) },
                data: {
                    name,
                    company,
                    address,
                    state,
                    users: {
                        deleteMany: { is_coordinator: true }, // Eliminar coordinador anterior
                        create: {
                            user_id: coordinator_id,
                            is_coordinator: true,
                            turn: null,
                        },
                    },
                },
            });

            res.send("Programa actualizado correctamente");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Elimina un programa si no tiene dependencias
     * @param req.params.id ID del programa
     * @returns Mensaje de confirmación de eliminación
     * @throws Error si el programa tiene bitácoras o usuarios asociados
     */
    static async deleteProgram(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const programExists = await prisma.programs.findUnique({
                where: { id: parseInt(id) },
                include: {
                    users: true,
                },
            });

            if (!programExists) {
                res.status(404).json({ error: "Programa no encontrado" });
                return;
            }

            const programBitacoras = await prisma.bitacoras.findMany({
                where: { program_id: parseInt(id) },
            });

            if (programBitacoras.length > 0) {
                res.status(400).json({
                    error:
                        "No se puede eliminar el programa porque tiene bitácoras asociadas",
                });
                return;
            }

            if (programExists.users.length > 0) {
                res.status(400).json({
                    error:
                        "No se puede eliminar el programa porque tiene usuarios asociados",
                });
                return;
            }

            await prisma.programs.delete({
                where: { id: parseInt(id) },
            });

            res.send("Programa eliminado correctamente");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Asocia un usuario a un programa con un turno específico
     * @param req.body.program_id ID del programa
     * @param req.body.user_id ID del usuario
     * @param req.body.turn Turno asignado al usuario
     * @returns Mensaje de confirmación de asociación
     * @throws Error si el usuario ya está asociado al programa
     */
    static async associateUser(req: Request, res: Response) {
        const { program_id, user_id, turn } = req.body;

        try {
            const programExists = await prisma.programs.findUnique({
                where: { id: program_id },
            });

            if (!programExists) {
                res.status(404).json({ error: "Programa no encontrado" });
                return;
            }

            const userExists = await prisma.users.findUnique({
                where: { id: user_id },
            });

            if (!userExists) {
                res.status(404).json({ error: "Usuario no encontrado" });
                return;
            }

            //Verificar que el usuario no esté asociado al programa
            const userProgram = await prisma.program_user.findFirst({
                where: { program_id, user_id },
            });

            if (userProgram) {
                res
                    .status(400)
                    .json({ error: "El usuario ya está asociado a este programa" });
                return;
            }

            await prisma.program_user.create({
                data: {
                    program_id,
                    user_id,
                    turn,
                },
            });

            res.send("Usuario asociado correctamente");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Elimina la asociación entre un usuario y un programa
     * @param req.params.id ID de la asociación programa-usuario
     * @returns Mensaje de confirmación de desasociación
     */
    static async disassociateUser(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const associationExists = await prisma.program_user.findUnique({
                where: { id: parseInt(id) },
            });

            if (!associationExists) {
                res.status(404).json({ error: "Asociación no encontrada" });
                return;
            }

            await prisma.program_user.delete({
                where: {
                    id: associationExists.id,
                },
            });

            res.send("Usuario desasociado correctamente");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Actualiza el turno de un usuario en un programa
     * @param req.params.id ID de la asociación programa-usuario
     * @param req.body.turn Nuevo turno a asignar
     * @returns Mensaje de confirmación de actualización
     */
    static async updateAssociation(req: Request, res: Response) {
        const { id } = req.params;
        const { turn } = req.body;

        try {
            const currentAssociation = await prisma.program_user.findUnique({
                where: { id: parseInt(id) },
            });

            if (!currentAssociation) {
                res.status(404).json({ error: "Asociación no encontrada" });
                return;
            }

            await prisma.program_user.update({
                where: {
                    id: currentAssociation.id,
                },
                data: {
                    turn,
                },
            });

            res.send("Asociación actualizada correctamente");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
