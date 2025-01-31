import type { Request, Response } from 'express';
import prisma from "../config/db";

export class DiseaseController {

    static async createDisease(req: Request, res: Response) {
        try {
            const { name, description, type, treatment_required, contagious, notes } = req.body;

            const disease = await prisma.diseases.create({
                data: {
                    name,
                    description,
                    type,
                    treatment_required,
                    contagious,
                    notes
                }
            });

            res.send('Enfermedad registrada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getDiseases(req: Request, res: Response) {
        try {
            const diseases = await prisma.diseases.findMany();

            res.status(200).json(diseases);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getDisease(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const disease = await prisma.diseases.findUnique({
                where: { id: parseInt(id) },
                
            });

            if (!disease) {
                res.status(404).json({ error: 'Enfermedad no encontrada' });
                return;
            }


            res.status(200).json(disease);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateDisease(req: Request, res: Response) {
        const { id } = req.params;
        try {

            console.log(req.body);
            const disease = await prisma.diseases.update({
                where: { id: parseInt(id) },
                data: req.body
            });

            res.send('Enfermedad actualizada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteDisease(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.diseases.delete({
                where: { id: parseInt(id) }
            });

            res.status(200).send('Enfermedad eliminada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async assignParticipant(req: Request, res: Response) {

        const { disease_id, participant_id, treatment_status, date, comments } = req.body;

        try {
            const disease = await prisma.diseases.findUnique({
                where: { id: parseInt(disease_id) }
            });

            if (!disease) {
                res.status(404).json({ error: 'Enfermedad no encontrada' });
                return;
            }

            const participant = await prisma.participants.findUnique({
                where: { id: parseInt(participant_id) }
            });

            if (!participant) {
                res.status(404).json({ error: 'Participante no encontrado' });
                return;
            }

            await prisma.disease_participant.create({
                data: {
                    disease_id: parseInt(disease_id),
                    participant_id: participant_id,
                    treatment_status,
                    date,
                    comments
                }
            });

            res.send('Seguimiento registrado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateAssignedDisease(req: Request, res: Response) {
        const { id, treatment_status, date, comments } = req.body;
        try {
            await prisma.disease_participant.update({
                where: {id: parseInt(id)},
                data: {
                    treatment_status,
                    date,
                    comments
                }
            });

            res.send('Seguimiento actualizado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteAssignedDisease(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.disease_participant.delete({
                where: { id: parseInt(id) }
            });

            res.send('Seguimiento eliminado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAssignedDisease(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const disease = await prisma.disease_participant.findUnique({
                where: { id: parseInt(id) }
            });

            if (!disease) {
                res.status(404).json({ error: 'Seguimiento no encontrado' });
                return;
            }

            res.status(200).json(disease);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}
