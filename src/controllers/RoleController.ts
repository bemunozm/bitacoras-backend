import type { Request, Response } from 'express';
import prisma from '../config/db';

export class RoleController {

    static async createRole(req: Request, res: Response) : Promise<void> {

        try {

            const roleExists = await prisma.roles.findFirst({
                where: { name: req.body.name }
            });

            if (roleExists) {
                res.status(400).json({ error: 'El rol ya existe' });
                return;
            }

            // Crear el rol
            await prisma.roles.create({
                data: req.body
            });

            res.send('Rol creado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        
    }

    static async getRoles(req: Request, res: Response) {
        
        try {
            const roles = await prisma.roles.findMany();

            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getRole(req: Request, res: Response) {

        const { id } = req.params;

        try {
            const role = await prisma.roles.findUnique({
                where: { id: parseInt(id) }
            });

            if (!role) {
                res.status(404).json({ error: 'Rol no encontrado' });
                return;
            }

            res.status(200).json(role);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async updateRole(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const role = await prisma.roles.findUnique({
                where: { id: parseInt(id) }
            });

            if (!role) {
                res.status(404).json({ error: 'Rol no encontrado' });
                return;
            }

            const roleExists = await prisma.roles.findFirst({
                where: { name: req.body.name, id: { not: parseInt(id) } }
            });

            if (roleExists) {
                res.status(400).json({ error: 'El rol ya existe' });
                return;
            }

            await prisma.roles.update({
                where: { id: parseInt(id) },
                data: req.body
            });

            res.send('Rol actualizado correctamente');
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async deleteRole(req: Request, res: Response) {

        const { id } = req.params;


        try {
            const role = await prisma.roles.findUnique({
                where: { id: parseInt(id) }
            });

            if (!role) {
                res.status(404).json({ error: 'Rol no encontrado' });
                return;
            }

            const roleInUse = await prisma.role_user.findFirst({
                where: { role_id: parseInt(id) }
            });

            if (roleInUse) {
                res.status(400).json({ error: 'El rol está en uso' });
                return;
            }

            await prisma.roles.delete({
                where: { id: parseInt(id) }
            });

            res.send('Rol eliminado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
}