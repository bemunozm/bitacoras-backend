import type { Request, Response } from 'express';
import prisma from '../config/db';

/**
 * Controlador para manejar todas las operaciones relacionadas con bitácoras
 * Incluye creación, consulta, actualización y eliminación de bitácoras,
 * así como la gestión de estados y filtrado por períodos
 */
export class BitacoraController {
    /**
     * Crea una nueva bitácora
     * @param req.body.month Mes de la bitácora
     * @param req.body.recipe Receta o plan de trabajo
     * @param req.body.user_id ID del usuario propietario
     * @param req.body.program_id ID del programa asociado
     * @returns Mensaje de confirmación de creación
     * @throws Error si ya existe una bitácora para el mismo mes, programa y usuario
     */
    static async createBitacora(req: Request, res: Response) {

        try{

            const { month, recipe, user_id, program_id} = req.body

            const user = await prisma.users.findUnique({
                where: { id: user_id }
            });

            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }

            const program = await prisma.programs.findUnique({
                where: { id: program_id }
            });

            if (!program) {
                res.status(404).json({ error: 'Programa no encontrado' });
                return;
            }

            const bitacoraExists = await prisma.bitacoras.findFirst({
                where: {
                    month,
                    user_id,
                    program_id
                }
            });

            if (bitacoraExists) {
                res.status(400).json({ error: 'Ya existe una bitácora para este mes y programa' });
                return;
            }

            await prisma.bitacoras.create({
                data: {
                    month,
                    recipe,
                    program: {
                        connect: { id: program_id }
                    },
                    user: {
                        connect: { id: user_id }
                    },
                }
            });

            res.send('Bitácora creada correctamente');

        } catch(error) {
            res.status(500).json({ error: error.message });
        }

    }

    /**
     * Obtiene todas las bitácoras con sus relaciones
     * @returns Lista de bitácoras incluyendo:
     * - Programa asociado y sus usuarios
     * - Actividades con sus adjuntos y categorías
     * - Usuario propietario
     */
    static async getBitacoras(req: Request, res: Response) {

        try {

            const bitacoras = await prisma.bitacoras.findMany({
                include: {
                    program: {
                        include: {
                            users: {
                                include: {
                                    user: true
                                }
                            },
                        }
                    },
                    activities: {
                        include: {
                            attachments: true,
                            category: true
                        }
                    },
                    user: true,
                }
            });

            res.status(200).json(bitacoras);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
            
        }

    }

    /**
     * Obtiene bitácoras filtradas por período de tiempo
     * @param req.params.period Período de tiempo a consultar:
     * - current_month: Mes actual
     * - last_month: Mes anterior
     * - last_3_months: Últimos 3 meses
     * - last_6_months: Últimos 6 meses
     * - history: Histórico completo
     * @returns Lista de bitácoras filtradas por el período seleccionado
     */
    static async getBitacorasByPeriod(req: Request, res: Response) {
        try {
            const { period } = req.params;

            // Configurar rango de fechas según el período
            let datePeriodStart: Date;
            let datePeriodEnd: Date = new Date();
            datePeriodEnd.setMonth(datePeriodEnd.getMonth() + 1);
            datePeriodEnd.setDate(0);

            // Calcular fecha inicial según el período solicitado
            switch (period) {
                case 'current_month':
                    datePeriodStart = new Date();
                    datePeriodStart.setDate(1);
                    break;
                case 'last_month':
                    datePeriodStart = new Date();
                    datePeriodStart.setMonth(datePeriodStart.getMonth() - 1);
                    datePeriodStart.setDate(1);
                    datePeriodEnd = new Date(datePeriodStart);
                    datePeriodEnd.setMonth(datePeriodEnd.getMonth() + 1);
                    datePeriodEnd.setDate(0);
                    break;
                case 'last_3_months':
                    datePeriodStart = new Date();
                    datePeriodStart.setMonth(datePeriodStart.getMonth() - 3);
                    break;
                case 'last_6_months':
                    datePeriodStart = new Date();
                    datePeriodStart.setMonth(datePeriodStart.getMonth() - 6);
                    break;
                case 'history':
                    datePeriodStart = new Date(0);
                    break;
                default:
                    datePeriodStart = new Date();
                    break;
            }

            // Consultar bitácoras en el rango de fechas con todas sus relaciones
            const bitacoras = await prisma.bitacoras.findMany({
                where: {
                    month: {
                        gte: datePeriodStart,
                        lte: datePeriodEnd
                    }
                },
                include: {
                    program: {
                        include: {
                            users: {
                                include: {
                                    user: true
                                }
                            },
                        }
                    },
                    activities: {
                        include: {
                            attachments: true,
                            category: true
                        }
                    },
                    user: true,
                }
            });

            res.status(200).json(bitacoras);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Obtiene una bitácora específica por su ID
     * @param req.params.id ID de la bitácora
     * @returns Bitácora con todas sus relaciones y datos del usuario formateados
     */
    static async getBitacora(req: Request, res: Response) {

        const { id } = req.params;

        try {
            
            const bitacora = await prisma.bitacoras.findUnique({
                where: { id: parseInt(id) },
                include: {
                    program: {
                        include: {
                            users: {
                                include: {
                                    user: true
                                }
                            },
                        }
                    },
                    activities: {
                        include: {
                            attachments:true,
                            category: true
                        }
                    },
                    user: {
                        include: {
                            roles: {
                                include: {
                                    roles: true
                                }
                            }
                        }
                    },
                }
            });
            

            if (!bitacora) {
                res.status(404).json({ error: 'Bitácora no encontrada' });
                return;
            }

            // Obtener los roles del usuario de la bitácora y formatear la respuesta para que no se consideren los datos de la tabla intermedia
            const bitacoraUserWithRoles = {
                ...bitacora.user,
                roles: bitacora.user.roles.map((role) => role.roles)
            }


            res.status(200).json({ ...bitacora, user: bitacoraUserWithRoles });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    /**
     * Actualiza los datos de una bitácora
     * @param req.params.id ID de la bitácora
     * @param req.body.month Nuevo mes
     * @param req.body.recipe Nueva receta o plan
     * @param req.body.status Nuevo estado
     * @param req.body.program_id ID del nuevo programa
     * @returns Mensaje de confirmación de actualización
     * @throws Error si ya existe otra bitácora para el mismo mes y programa
     */
    static async updateBitacora(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const bitacoraExists = await prisma.bitacoras.findFirst({
                where: {
                    id: { not: parseInt(id) },
                    month: req.body.month,
                    user_id: req.body.user_id,
                    program_id: req.body.program_id
                }
            });

            if (bitacoraExists) {
                res.status(400).json({ error: 'Ya existe otra bitácora para este mes y programa' });
                return;
            }
            
            await prisma.bitacoras.update({
                where: { id: parseInt(id) },
                data: {
                    month: req.body.month,
                    recipe: req.body.recipe,
                    status: req.body.status,
                    program: {
                        connect: { id: req.body.program_id }
                    }
                }
            });

            res.send('Bitácora actualizada correctamente');
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    /**
     * Elimina una bitácora
     * @param req.params.id ID de la bitácora
     * @returns Mensaje de confirmación de eliminación
     * @throws Error si la bitácora tiene actividades asociadas
     */
    static async deleteBitacora(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const bitacora = await prisma.bitacoras.findUnique({
                where: { id: parseInt(id) }
            });

            if (!bitacora) {
                res.status(404).json({ error: 'Bitácora no encontrada' });
                return;
            }

            //Verificar que no tenga actividades asociadas
            const activities = await prisma.activities.findMany({
                where: { bitacora_id: parseInt(id) }
            });

            if (activities.length > 0) {
                res.status(400).json({ error: 'No se puede eliminar la bitácora porque tiene actividades asociadas' });
                return;
            }

            await prisma.bitacoras.delete({
                where: { id: parseInt(id) }
            });

            res.send('Bitácora eliminada correctamente');
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    /**
     * Actualiza el estado de una bitácora
     * @param req.params.id ID de la bitácora
     * @param req.body.status Nuevo estado a asignar
     * @returns Nuevo estado asignado
     */
    static async changeBitacoraStatus(req: Request, res: Response) {

        const { id } = req.params;
        const { status } = req.body;

        try {
            
            await prisma.bitacoras.update({
                where: { id: parseInt(id) },
                data: {
                    status
                }
            });

            res.send(status);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
