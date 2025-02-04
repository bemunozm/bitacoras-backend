import type { Request, Response } from 'express';
import prisma from "../config/db";

export class ProvisionCategoryController {

    static async createProvisionCategory(req: Request, res: Response) {
        try {
            const { name, description } = req.body;

            const categoryExists = await prisma.provision_categories.findFirst({
                where: { name }
            });

            if (categoryExists) {
                res.status(400).json({ error: 'La categoría de provisión ya existe' });
                return;
            }

            await prisma.provision_categories.create({
                data: {
                    name,
                    description
                }
            });

            res.send('Categoría de provisión creada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProvisionCategories(req: Request, res: Response) {
        try {
            const categories = await prisma.provision_categories.findMany({
                include: {
                    provisions: true
                }
            });
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProvisionCategory(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const category = await prisma.provision_categories.findUnique({
                where: { id: parseInt(id) },
                include: {
                    provisions: true
                }
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

    static async updateProvisionCategory(req: Request, res: Response) {
        const { id } = req.params;
        try {

            const categoryExists = await prisma.provision_categories.findFirst({
                where: { id: parseInt(id) }
            });

            if (!categoryExists) {
                res.status(404).json({ error: 'Categoría no encontrada' });
                return;
            }

            const otherCategoryExists = await prisma.provision_categories.findFirst({
                where: {
                    name: req.body.name,
                    id: {
                        not: parseInt(id)
                    }
                }
            });

            if (otherCategoryExists) {
                res.status(400).json({ error: 'La categoría ya existe' });
                return;
            }

            await prisma.provision_categories.update({
                where: { id: parseInt(id) },
                data: req.body
            });

            res.send('Categoría actualizada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteProvisionCategory(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.provision_categories.delete({
                where: { id: parseInt(id) }
            });

            res.status(200).send('Categoría eliminada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
