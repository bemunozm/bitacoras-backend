import type { Request, Response } from 'express';
import prisma from '../config/db';

export class BitacoraController {

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
                    programs: {
                        connect: { id: program_id }
                    },
                    users: {
                        connect: { id: user_id }
                    },
                }
            });

            res.send('Bitácora creada correctamente');

        } catch(error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async getBitacoras(req: Request, res: Response) {

        try {

            const bitacoras = await prisma.bitacoras.findMany({
                include: {
                    programs: {
                        include: {
                            coordinator: true,
                            residences: {
                                include: {
                                    residences: true
                                }
                            },
                        }
                    },
                    activities: {
                        include: {
                            attachments: true,
                            categories: true
                        }
                    },
                    users: true,
                }
            });

            const bitacorasWithResidences = bitacoras.map(bitacora => ({
                ...bitacora,
                programs: {
                    ...bitacora.programs,
                    residences: bitacora.programs.residences.map(residence => residence.residences)
                }
            }));


            res.status(200).json(bitacorasWithResidences);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
            
        }

    }

    static async getBitacorasByPeriod(req: Request, res: Response) {
        try {
            const { period } = req.params;
            let datePeriodStart: Date;
            let datePeriodEnd: Date = new Date();
            datePeriodEnd.setMonth(datePeriodEnd.getMonth() + 1);
            datePeriodEnd.setDate(0);

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

            console.log('📅', datePeriodStart, '-', datePeriodEnd);

            const bitacoras = await prisma.bitacoras.findMany({
                where: {
                    month: {
                        gte: datePeriodStart,
                        lte: datePeriodEnd
                    }
                },
                include: {
                    programs: {
                        include: {
                            coordinator: true,
                            residences: {
                                include: {
                                    residences: true
                                }
                            },
                        }
                    },
                    activities: {
                        include: {
                            attachments: true,
                            categories: true
                        }
                    },
                    users: true,
                }
            });

            const bitacorasWithResidences = bitacoras.map(bitacora => ({
                ...bitacora,
                programs: {
                    ...bitacora.programs,
                    residences: bitacora.programs.residences.map(residence => residence.residences)
                }
            }));

            res.status(200).json(bitacorasWithResidences);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getBitacora(req: Request, res: Response) {

        const { id } = req.params;

        try {
            
            const bitacora = await prisma.bitacoras.findUnique({
                where: { id: parseInt(id) },
                include: {
                    programs: {
                        include: {
                            coordinator: true,
                            residences: {
                                include: {
                                    residences: true
                                }
                            },
                        }
                    },
                    activities: {
                        include: {
                            attachments:true,
                            categories: true
                        }
                    },
                    users: true,
                }
            });

            
            

            if (!bitacora) {
                res.status(404).json({ error: 'Bitácora no encontrada' });
                return;
            }

            const bitacoraWithResidences = {
                ...bitacora,
                programs: {
                    ...bitacora.programs,
                    residences: bitacora.programs.residences.map(residence => residence.residences)
                }
            };


            res.status(200).json(bitacoraWithResidences);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

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
                    programs: {
                        connect: { id: req.body.program_id }
                    }
                }
            });

            res.send('Bitácora actualizada correctamente');
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

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
   