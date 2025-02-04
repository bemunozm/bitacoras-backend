import type { Request, Response } from 'express';
import prisma from '../config/db';

export class ResidenceController {

    static async createResidence(req: Request, res: Response) {

        try {

            const residenceExists = await prisma.residences.findFirst({
                where: { name: req.body.name }
            });

            if (residenceExists) {
                res.status(400).json({ error: 'La residencia ya existe' });
                return;
            }
            
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

            const residences = await prisma.residences.findMany({
                include: {
                    participants : {
                        include: {
                            participants: true
                        }
                    }
                }
            });

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

            const residenceExists = await prisma.residences.findFirst({
                where: {
                    name: req.body.name,
                    id: {
                        not: parseInt(id)
                    }
                }
            });

            if (residenceExists) {
                res.status(400).json({ error: 'Ya existe una residencia con este nombre' });
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

    static async ParticipantEntrance(req: Request, res: Response) {
        
        const { participant_id, residence_id, status, admission_date, departure_date, admission_notes } = req.body;

        try {
            const residence = await prisma.residences.findUnique({
                where: { id: parseInt(residence_id) }
            });

            if (!residence) {
                res.status(404).json({ error: 'Residencia no encontrada' });
                return;
            }

            const participant = await prisma.participants.findUnique({
                where: { id: parseInt(participant_id) }
            });

            if (!participant) {
                res.status(404).json({ error: 'Participante no encontrado' });
                return;
            }

            await prisma.participant_residence.create({
                data: {
                    participant_id: parseInt(participant_id),
                    residence_id: parseInt(residence_id),
                    status: status || 'Residencia en Curso',
                    admission_date,
                    departure_date,
                    admission_notes
                }
            });

            res.send('Ingreso registrado correctamente');
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async ParticipantDeparture(req: Request, res: Response) {
        
        const { participant_id, residence_id, status, departure_date, departure_notes } = req.body;

        try {
            const residence = await prisma.residences.findUnique({
                where: { id: parseInt(residence_id) }
            });

            if (!residence) {
                res.status(404).json({ error: 'Residencia no encontrada' });
                return;
            }

            const participant = await prisma.participants.findUnique({
                where: { id: parseInt(participant_id) }
            });

            if (!participant) {
                res.status(404).json({ error: 'Participante no encontrado' });
                return;
            }

            const participantResidence = await prisma.participant_residence.findFirst({
                where: {
                    participant_id: parseInt(participant_id),
                    residence_id: parseInt(residence_id),
                    status: { in: ['Residencia en Curso', 'Pendiente de Salida', 'Pendiente de Admision'] }
                }
            });

            if (!participantResidence) {
                res.status(404).json({ error: 'El participante no se encuentra en la residencia' });
                return;
            }

            await prisma.participant_residence.update({
                where: { id: participantResidence.id },
                data: {
                    status: status || 'Finalizado',
                    departure_date,
                    departure_notes
                }
            });

            res.send('Salida registrada correctamente');
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getActiveParticipants(req: Request, res: Response) {


        try {
            const participants = await prisma.participant_residence.findMany({
                where: {
                    status: {
                        in: ['Residencia en Curso', 'Pendiente de Salida']
                    }
                },
                include: {
                    participants: true,
                    residences: true
                },
            });

            const activeParticipants = participants.map(participant => {
                return {
                    id: participant.id,
                    admission_date: participant.admission_date,
                    departure_date: participant.departure_date,
                    status: participant.status,
                    admission_notes: participant.admission_notes,
                    departure_notes: participant.departure_notes,
                    residence: participant.residences,
                    participant: participant.participants
                }
            });

            res.status(200).json(activeParticipants);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getParticipantsByResidence(req: Request, res: Response) {

        const { id } = req.params;

        try {
            const residence = await prisma.residences.findUnique({
                where: { id: parseInt(id) }
            });

            if (!residence) {
                res.status(404).json({ error: 'Residencia no encontrada' });
                return;
            }

            const participants_residence = await prisma.participant_residence.findMany({
                where: {
                    residence_id: parseInt(id)
                },
                include: {
                    participants: true,
                }
            });

            const participants = participants_residence.map(participant => {
                return {
                    id: participant.id,
                    admission_date: participant.admission_date,
                    departure_date: participant.departure_date,
                    status: participant.status,
                    admission_notes: participant.admission_notes,
                    departure_notes: participant.departure_notes,
                    participant: participant.participants
                }
            })
            res.status(200).json(participants);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
