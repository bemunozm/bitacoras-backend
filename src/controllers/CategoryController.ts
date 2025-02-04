import type { Request, Response } from 'express';
import prisma from '../config/db';

export class CategoryController {

    static async createCategory(req: Request, res: Response) {
        
        try {

            const categoryExists = await prisma.categories.findFirst({
                where: { name: req.body.name }
            });

            if (categoryExists) {
                res.status(400).json({ error: 'La categoría ya existe' });
                return;
            }
            
            await prisma.categories.create({
                data: req.body
            });

            res.send('Categoría creada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        
    }

    static async getCategories(req: Request, res: Response) {

        try {

            const categories = await prisma.categories.findMany();

            res.status(200).json(categories);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
            
        }

    }

    static async getCategory(req: Request, res: Response) {

        const { id } = req.params;

        try {
            
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

    static async updateCategory(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const categoryExists = await prisma.categories.findFirst({
                where: { name: req.body.name, id: { not: parseInt(id) } }
            });

            if (categoryExists) {
                res.status(400).json({ error: 'La categoría ya existe' });
                return;
            }
            
            await prisma.categories.update({
                where: { id: parseInt(id) },
                data: req.body
            });

            res.send('Categoría actualizada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async deleteCategory(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const categoryExists = await prisma.categories.findUnique({
                where: { id: parseInt(id) }
            });

            if (!categoryExists) {
                res.status(404).json({ error: 'Categoría no encontrada' });
                return;
            }

            //Verificar que no tenga actividades asociadas
            const activities = await prisma.activities.findMany({
                where: { category_id: parseInt(id) }
            });

            if (activities.length > 0) {
                res.status(400).json({ error: 'La categoría tiene actividades asociadas. Debes eliminarlas antes de eliminar la categoría.' });
                return;
            }
            
            
            await prisma.categories.delete({
                where: { id: parseInt(id) }
            });

            res.send('Categoría eliminada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
}