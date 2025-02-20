import type { Request, Response } from 'express';
import prisma from '../config/db';

/**
 * Controlador para manejar todas las operaciones CRUD relacionadas con categorías
 */
export class CategoryController {
    /**
     * Crea una nueva categoría
     * @param req.body.name Nombre de la categoría
     * @returns Mensaje de confirmación de creación
     */
    static async createCategory(req: Request, res: Response) {
        try {
            //Verifica que no exista una categoría con el mismo nombre
            const categoryExists = await prisma.categories.findFirst({
                where: { name: req.body.name }
            });

            if (categoryExists) {
                res.status(400).json({ error: 'La categoría ya existe' });
                return;
            }
            
            //Crea la nueva categoría
            await prisma.categories.create({
                data: req.body
            });

            res.send('Categoría creada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Obtiene todas las categorías
     * @returns Lista de categorías
     */
    static async getCategories(req: Request, res: Response) {
        try {
            const categories = await prisma.categories.findMany();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Obtiene una categoría específica por su ID
     * @param req.params.id ID de la categoría
     * @returns Detalles de la categoría
     */
    static async getCategory(req: Request, res: Response) {
        const { id } = req.params;

        try {
            //Busca la categoría por ID
            const category = await prisma.categories.findUnique({
                where: { id: parseInt(id) }
            });
            
            if (!category) {
                res.status(404).json({ error: 'Categoría no encontrada' });
                return;
            }

            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Actualiza una categoría existente
     * @param req.params.id ID de la categoría a actualizar
     * @param req.body Datos actualizados de la categoría
     * @returns Mensaje de confirmación de actualización
     */
    static async updateCategory(req: Request, res: Response) {
        const { id } = req.params;

        try {
            //Verifica que no exista otra categoría con el mismo nombre
            const categoryExists = await prisma.categories.findFirst({
                where: { name: req.body.name, id: { not: parseInt(id) } }
            });

            if (categoryExists) {
                res.status(400).json({ error: 'La categoría ya existe' });
                return;
            }
            
            //Actualiza la categoría
            await prisma.categories.update({
                where: { id: parseInt(id) },
                data: req.body
            });

            res.send('Categoría actualizada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Elimina una categoría
     * @param req.params.id ID de la categoría a eliminar
     * @returns Mensaje de confirmación de eliminación
     */
    static async deleteCategory(req: Request, res: Response) {
        const { id } = req.params;

        try {
            //Verifica que la categoría exista
            const categoryExists = await prisma.categories.findUnique({
                where: { id: parseInt(id) }
            });

            if (!categoryExists) {
                res.status(404).json({ error: 'Categoría no encontrada' });
                return;
            }

            //Verifica que no tenga actividades asociadas
            const activities = await prisma.activities.findMany({
                where: { category_id: parseInt(id) }
            });

            if (activities.length > 0) {
                res.status(400).json({ error: 'La categoría tiene actividades asociadas. Debes eliminarlas antes de eliminar la categoría.' });
                return;
            }
            
            //Elimina la categoría
            await prisma.categories.delete({
                where: { id: parseInt(id) }
            });

            res.send('Categoría eliminada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}