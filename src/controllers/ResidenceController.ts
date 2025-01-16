import type { Request, Response } from 'express';
import prisma from '../config/db';

export class ResidenceController {

    static async createResidence(req: Request, res: Response) {

        try {
            
            await prisma.residences.create({
                data: req.body
            });

            res.send('Residencia creada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        
    }

    static async getResidences(req: Request, res: Response) {

        try {

            const residences = await prisma.residences.findMany();

            res.status(200).json(residences);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
            
        }

    }

    static async getResidence(req: Request, res: Response) {

        const { id } = req.params;

        try {
            
            const residence = await prisma.residences.findUnique({
                where: { id: parseInt(id) }
            });
            

            if (!residence) {
                res.status(404).json({ error: 'Residencia no encontrada' });
                return;
            }

            res.status(200).json(residence);

        } catch (error) {
            
        }

    }

    static async updateResidence(req: Request, res: Response) {
        
        const { id } = req.params;

        try {

            const residence = await prisma.residences.findUnique({
                where: { id: parseInt(id) }
            });

            if (!residence) {
                res.status(404).json({ error: 'Residencia no encontrada' });
                return;
            }

            await prisma.residences.update({
                where: { id: parseInt(id) },
                data: req.body
            });

            res.send('Residencia actualizada correctamente');
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async deleteResidence(req: Request, res: Response) {
        
        const { id } = req.params;

        try {
            const residence = await prisma.residences.findUnique({
                where: { id: parseInt(id) }
            });

            if (!residence) {
                res.status(404).json({ error: 'Residencia no encontrada' });
                return;
            }

            await prisma.residences.delete({
                where: { id: parseInt(id) }
            });

            res.send('Residencia eliminada correctamente');
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}