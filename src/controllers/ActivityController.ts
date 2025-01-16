import type { Request, Response } from 'express';
import prisma from '../config/db';

import {v2 as cloudinary} from 'cloudinary';

export class ActivityController {

    static async createActivity(req: Request, res: Response) {
        
        try{


            const { description, date, bitacora_id, category_id} = req.body
            const files = req.files as Express.Multer.File[];

            const bitacora = await prisma.bitacoras.findUnique({
                where: { id: +bitacora_id }
            });

            if (!bitacora) {
                res.status(404).json({ error: 'Bitácora no encontrada' });
                return;
            }

            const category = await prisma.categories.findUnique({
                where: { id: +category_id }
            });

            if (!category) {
                res.status(404).json({ error: 'Categoria no encontrada' });
                return;
            }

            //Verificar que la fecha de la actividad sea dentro del mismo mes de la bitácora
            const bitacoraMonth = new Date(bitacora.month).getMonth();
            const activityMonth = new Date(date).getMonth();

            if (bitacoraMonth !== activityMonth) {
                res.status(400).json({ error: 'La fecha de la actividad no coincide con el mes de la bitácora' });
                return;
            }

            const activity = await prisma.activities.create({
                data: {
                    description,
                    date,
                    bitacora_id: +bitacora_id,
                    category_id: +category_id
                }
            });

            if (files && files.length > 0) {

                const attachmentsData = files.map((file) => ({
                    image: file.path,
                    activity_id: activity.id,
                }));

    
                await prisma.attachments.createMany({ data: attachmentsData });
            }


            res.send('Actividad creada correctamente');

        } catch(error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async getActivities(req: Request, res: Response) {

        try {

            const activities = await prisma.activities.findMany({
                include: {
                    categories: true,
                    attachments: true
                }
            });

            res.json(activities);

        } catch(error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async getActivity(req: Request, res: Response) {

        try {

            const { id } = req.params;

            const activity = await prisma.activities.findUnique({
                where: { id: +id },
                include: {
                    categories: true,
                    attachments: true
                }
            });

            if (!activity) {
                res.status(404).json({ error: 'Actividad no encontrada' });
                return;
            }

            res.json(activity);

        } catch(error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async updateActivity(req: Request, res: Response) {

        try {

            const { id } = req.params;
            const files = req.files as Express.Multer.File[];

            const { description, date, category_id, existingAttachments } = req.body;

            console.log('🚨 Imagenes existentes', existingAttachments)
            console.log('🚨 Archivos nuevos', files)


            const activity = await prisma.activities.findUnique({
                where: { id: +id }
            });

            if (!activity) {
                res.status(404).json({ error: 'Actividad no encontrada' });
                return;
            }

            const category = await prisma.categories.findUnique({
                where: { id: +category_id }
            });

            if (!category) {
                res.status(404).json({ error: 'Categoria no encontrada' });
                return;
            }

            // Verificar que la fecha de la actividad sea dentro del mismo mes de la bitácora
            const bitacora = await prisma.bitacoras.findUnique({
                where: { id: +activity.bitacora_id }
            });

            const bitacoraMonth = new Date(bitacora.month).getMonth();
            const activityMonth = new Date(date).getMonth();

            if (bitacoraMonth !== activityMonth) {
                res.status(400).json({ error: 'La fecha de la actividad no coincide con el mes de la bitácora' });
                return;
            }

            await prisma.activities.update({
                where: { id: Number(id) },
                data: {
                    description,
                    date,
                    category_id: +category_id
                }
            });

            //Si no hay archivos existentes, eliminar todos los existentes
            if (!existingAttachments) {
                
                console.log('🚨Eliminando todos los archivos adjuntos')

                const existingAttachments = await prisma.attachments.findMany({
                    where: { activity_id: Number(id) }
                });

                if (existingAttachments.length > 0) {
                    await prisma.attachments.deleteMany({
                        where: {
                            activity_id: Number(id)
                        }
                    });

                    existingAttachments.forEach((attachment) => {
                        cloudinary.uploader.destroy(attachment.image.split('/').pop().split('.')[0]);
                    });
                }
            }

            
            // Manejar eliminación de archivos adjuntos
            if (existingAttachments) {
                const existingAttachmentsBD = await prisma.attachments.findMany({
                    where: { activity_id: Number(id) }
                });

                console.log('🚨 Imagenes existentes en BD', existingAttachmentsBD)

                //Comparar los archivos existentes en la BD con los existentes para ver si se eliminaron
                const attachmentsToDelete = existingAttachmentsBD.filter((attachment) => {
                    console.log('Sigue existinedo?', existingAttachments.some((existingAttachment) => existingAttachment.id === attachment.id))
                    return !existingAttachments.some((existingAttachment) => +existingAttachment.id === attachment.id);
                });


                console.log('🚨 Archivos a eliminar', attachmentsToDelete)

                if (attachmentsToDelete.length > 0) {
                    await prisma.attachments.deleteMany({
                        where: {
                            id: { in: attachmentsToDelete.map((attachment) => attachment.id) }
                        }
                    });

                    attachmentsToDelete.forEach((attachment) => {
                        cloudinary.uploader.destroy(attachment.image.split('/').pop().split('.')[0]);
                    });
                }
            }

            

            // Manejar archivos adjuntos
            if (files && files.length > 0) {
                const attachmentsData = files.map((file) => ({
                    image: file.path,
                    activity_id: Number(id),
                }));

                await prisma.attachments.createMany({ data: attachmentsData });
            }


            res.send('Actividad actualizada correctamente');

        } catch(error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async deleteActivity(req: Request, res: Response) {

        try {

            const { id } = req.params;

            const activity = await prisma.activities.findUnique({
                where: { id: Number(id) }
            });

            if (!activity) {
                res.status(404).json({ error: 'Actividad no encontrada' });
                return;
            }

            // Eliminar archivos adjuntos
            const attachments = await prisma.attachments.findMany({
                where: { activity_id: Number(id) }
            });

            if (attachments.length > 0) {
                await prisma.attachments.deleteMany({
                    where: {
                        activity_id: Number(id)
                    }
                });

                attachments.forEach((attachment) => {
                    cloudinary.uploader.destroy(attachment.image.split('/').pop().split('.')[0]);
                });
            }

            await prisma.activities.delete({
                where: { id: Number(id) }
            });

            res.send('Actividad eliminada correctamente');

        } catch(error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async getActivitiesByBitacora(req: Request, res: Response) {

        try {

            const { id } = req.params;

            const bitacora = await prisma.bitacoras.findUnique({
                where: { id: Number(id) }
            });

            if (!bitacora) {
                res.status(404).json({ error: 'Bitácora no encontrada' });
                return;
            }

            const activities = await prisma.activities.findMany({
                where: { bitacora_id: Number(id) },
                include: {
                    categories: true,
                    attachments: true
                }
            });

            res.json(activities);

        } catch(error) {
            res.status(500).json({ error: error.message });
        }

    }



}