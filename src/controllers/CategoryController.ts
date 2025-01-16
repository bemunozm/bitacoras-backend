import type { Request, Response } from 'express';
import prisma from '../config/db';

export class CategoryController {

    static async createCategory(req: Request, res: Response) {
        
        try {
            
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
            
            await prisma.categories.delete({
                where: { id: parseInt(id) }
            });

            res.send('Categoría eliminada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
}