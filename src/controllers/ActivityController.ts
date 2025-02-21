import type { Request, Response } from 'express';
import prisma from '../config/db';
import {v2 as cloudinary} from 'cloudinary';

/**
 * Controlador para manejar todas las operaciones relacionadas con actividades
 * Incluye crear, actualizar, eliminar y consultar actividades con sus archivos adjuntos
 */
export class ActivityController {
    /**
     * Crea una nueva actividad en una bitácora específica
     * @param req.body.description Descripción de la actividad
     * @param req.body.date Fecha de la actividad
     * @param req.body.bitacora_id ID de la bitácora asociada
     * @param req.body.category_id ID de la categoría
     * @param req.files Archivos adjuntos (opcional)
     * @returns Mensaje de confirmación de creación
     */
    static async createActivity(req: Request, res: Response) {
        try {
            const { description, date, bitacora_id, category_id} = req.body;
            const files = req.files as Express.Multer.File[];
            
            //Obtener y validar que la bitacora existe
            const bitacora = await prisma.bitacoras.findUnique({
                where: { id: +bitacora_id }
            });

            if (!bitacora) {
                res.status(404).json({ error: 'Bitácora no encontrada' });
                return;
            }

//Obtener y validar que la categoría existe
            const category = await prisma.categories.findUnique({
                where: { id: +category_id }
            });

            if (!category) {
                res.status(404).json({ error: 'Categoria no encontrada' });
                return;
            }

            //Verificar que la fecha de la actividad sea dentro del mismo mes y año de la bitácora
            const bitacoraDate = new Date(bitacora.month);
            const activityDate = new Date(date);
            const bitacoraMonth = bitacoraDate.getMonth();
            const bitacoraYear = bitacoraDate.getFullYear();
            const activityMonth = activityDate.getMonth();
            const activityYear = activityDate.getFullYear();

            if (bitacoraMonth !== activityMonth || bitacoraYear !== activityYear) {
                res.status(400).json({ error: 'La fecha de la actividad debe corresponder al mes y año de la bitácora' });
                return;
            }

            if (bitacoraMonth !== activityMonth) {
                res.status(400).json({ error: 'La fecha de la actividad debe corresponder al mes de la bitácora' });
                return;
            }

            //Crear la actividad
            const activity = await prisma.activities.create({
                data: {
                    description,
                    date,
                    bitacora_id: +bitacora_id,
                    category_id: +category_id
                }
            });

            //Si hay archivos adjuntos, guardarlos y asociarlos a la actividad
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

    /**
     * Actualiza una actividad existente y sus archivos adjuntos
     * @param req.params.id ID de la actividad
     * @param req.body.description Nueva descripción
     * @param req.body.date Nueva fecha
     * @param req.body.category_id Nueva categoría
     * @param req.body.existingAttachments Archivos adjuntos que se mantienen
     * @param req.files Nuevos archivos adjuntos
     * @returns Mensaje de confirmación de actualización
     */
    static async updateActivity(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const files = req.files as Express.Multer.File[];
            const { description, date, category_id, existingAttachments } = req.body;

            // Verificar que la actividad exista
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
                res.status(400).json({ error: 'La fecha de la actividad debe corresponder al mes de la bitácora' });
                return;
            }

            //Actualizar datos básicos de la actividad
            await prisma.activities.update({
                where: { id: Number(id) },
                data: { description, date, category_id: +category_id }
            });

            //Si no hay archivos existentes, eliminar todos los existentes
            if (!existingAttachments) {
                //Si no se especifican archivos a mantener, eliminar todos
                const attachments = await prisma.attachments.findMany({
                    where: { activity_id: Number(id) }
                });

                if (attachments.length > 0) {
                    await prisma.attachments.deleteMany({
                        where: { activity_id: Number(id) }
                    });

                    //Eliminar archivos de Cloudinary
                    attachments.forEach((attachment) => {
                        cloudinary.uploader.destroy(attachment.image.split('/').pop().split('.')[0]);
                    });
                }
            } else {
                //Eliminar solo los archivos que ya no están en la lista
                const currentAttachments = await prisma.attachments.findMany({
                    where: { activity_id: Number(id) }
                });

                const attachmentsToDelete = currentAttachments.filter(
                    attachment => !existingAttachments.some(
                        existing => +existing.id === attachment.id
                    )
                );

                if (attachmentsToDelete.length > 0) {
                    await prisma.attachments.deleteMany({
                        where: {
                            id: { in: attachmentsToDelete.map(a => a.id) }
                        }
                    });

                    //Eliminar archivos de Cloudinary
                    attachmentsToDelete.forEach((attachment) => {
                        cloudinary.uploader.destroy(attachment.image.split('/').pop().split('.')[0]);
                    });
                }
            }

            //Agregar nuevos archivos adjuntos
            if (files?.length > 0) {
                await prisma.attachments.createMany({
                    data: files.map(file => ({
                        image: file.path,
                        activity_id: Number(id),
                    }))
                });
            }

            res.send('Actividad actualizada correctamente');
        } catch(error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Obtiene todas las actividades con sus categorías y archivos adjuntos
     * @returns Lista de actividades con sus relaciones
     */
    static async getActivities(req: Request, res: Response) {

        try {

            const activities = await prisma.activities.findMany({
                include: {
                    category: true,
                    attachments: true
                }
            });

            res.json(activities);

        } catch(error) {
            res.status(500).json({ error: error.message });
        }

    }

    /**
     * Obtiene una actividad específica por su ID
     * @param req.params.id ID de la actividad
     * @returns Detalles de la actividad con sus relaciones
     */
    static async getActivity(req: Request, res: Response) {

        try {

            const { id } = req.params;

            const activity = await prisma.activities.findUnique({
                where: { id: +id },
                include: {
                    category: true,
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

    /**
     * Elimina una actividad y sus archivos adjuntos
     * @param req.params.id ID de la actividad
     * @returns Mensaje de confirmación de eliminación
     */
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

                //Eliminar los archivos de Cloudinary
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

    /**
     * Obtiene todas las actividades de una bitácora específica
     * @param req.params.id ID de la bitácora
     * @returns Lista de actividades de la bitácora con sus relaciones
     */
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

            //Obtener todas las actividades de la bitácora con sus relaciones
            const activities = await prisma.activities.findMany({
                where: { bitacora_id: Number(id) },
                include: {
                    category: true,
                    attachments: true
                }
            });

            res.json(activities);

        } catch(error) {
            res.status(500).json({ error: error.message });
        }

    }
}