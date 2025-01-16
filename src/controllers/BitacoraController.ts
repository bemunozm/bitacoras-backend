import type { Request, Response } from 'express';
import prisma from '../config/db';
import path from 'path';
import fs from 'fs';


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

        console.log(req.body);

        try {
            
            await prisma.bitacoras.update({
                where: { id: parseInt(id) },
                data: {
                    month: req.body.month,
                    recipe: req.body.recipe,
                    status: req.body.status,
                    programs: {
                        connect: { id: req.body.program_id }
                    },
                    users: {
                        connect: { id: req.body.user_id }
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

            // //Eliminar actividades y archivos adjuntos
            // const activities = await prisma.activities.findMany({
            //     where: { bitacora_id: parseInt(id) },
            //     include: {
            //         attachments: true
            //     }
            // });

            // //Eliminar imagenes guardadas en el servidor
            // for (const activity of activities) {
            //     if (activity.attachments.length > 0) {
            //         await prisma.attachments.deleteMany({
            //             where: {
            //                 activity_id: activity.id
            //             }
            //         });

            //         activity.attachments.forEach((attachment) => {
            //             const filePath = path.join(__dirname, '../../', attachment.image);
            //             fs.unlink(filePath, (err) => {
            //                 if (err) {
            //                     console.error(`Error al eliminar el archivo: ${filePath}`, err);
            //                 }
            //             });
            //         });
            //     }
            // }
            
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