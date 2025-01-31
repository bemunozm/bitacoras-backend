import type { Request, Response } from 'express';
import prisma from "../config/db";


export class ParticipantController {

    static async createParticipant(req: Request, res: Response) {
        
        try {

            const { name, run, gender, birthdate, nationality} = req.body;

            const participantExists = await prisma.participants.findFirst({
                where: {
                    run: run
                }
            });

            if (participantExists) {
                res.status(409).json({ error: 'El participante ya se encuentra registrado.' });
                return;
            }
            
            await prisma.participants.create({
                data: {
                    name,
                    run,
                    birthdate: birthdate ? birthdate : null,
                    nationality,
                    gender
                }
            });

            res.send('Participante registrado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        
    }

    static async getParticipants(req: Request, res: Response) {
        
        try {

            const participants = await prisma.participants.findMany();

            res.status(200).json(participants);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
            
        }

    }

    static async getParticipant(req: Request, res: Response) {
        
        const { id } = req.params;

        try {
            
            const participant = await prisma.participants.findUnique({
                where: { id: parseInt(id) }
            });

            if (!participant) {
                res.status(404).json({ error: 'Participante no encontrado' });
                return;
            }

            res.status(200).json(participant);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async getPopulatedParticipant(req: Request, res: Response) {
        
        const { id } = req.params;

        try {
            
            const participant = await prisma.participants.findUnique({
                where: { id: parseInt(id) },
                include: {
                    provisions: {
                        include: {
                            provision: {
                                include: {
                                    category: true
                                }
                            }
                        }
                    },
                    diseases: {
                        include: {
                            diseases: true
                        }
                    },
                    events: true
                }
            });
            

            if (!participant) {
                res.status(404).json({ error: 'Participante no encontrado' });
                return;
            }

            const participantPopulated = {
                ...participant,
                provisions: participant.provisions.map(provision => provision),
                diseases: participant.diseases.map(disease => disease.diseases),
                events: participant.events
            }

            res.status(200).json(participantPopulated);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async updateParticipant(req: Request, res: Response) {
        
        const { id } = req.params;

        try {
            
            await prisma.participants.update({
                where: { id: parseInt(id) },
                data: {
                    ...req.body,
                    birthdate: req.body.birthdate ? req.body.birthdate : null
                }
            });

            res.send('Participante actualizado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async deleteParticipant(req: Request, res: Response) {
        
        const { id } = req.params;

        try {
            
            await prisma.participants.delete({
                where: { id: parseInt(id) }
            });

            res.send('Participante eliminado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async getDiseasesByParticipant(req: Request, res: Response) {
        
        const { id } = req.params;

        try {
            
            const participant = await prisma.participants.findUnique({
                where: { id: parseInt(id) },
                include: {
                    diseases: {
                        include: {
                            diseases: true
                        }
                    }
                }
            });

            if (!participant) {
                res.status(404).json({ error: 'Participante no encontrado' });
                return;
            }

            const detailedDiseases = participant.diseases.map(disease => ({
                id: disease.id,
                date: disease.date,
                treatment_status: disease.treatment_status,
                comments: disease.comments,
                disease: disease.diseases
            }));
            
            console.log(detailedDiseases);

            res.status(200).json(detailedDiseases);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async deliverBenefits(req: Request, res: Response) {
        
        const { participant_id, date, turn, benefits } = req.body;

        try {
            
            const participant = await prisma.participants.findUnique({
                where: { id: parseInt(participant_id) }
            });

            if (!participant) {
                res.status(404).json({ error: 'Participante no encontrado' });
                return;
            }

            for (const benefit of benefits) {
                const provisionExists = await prisma.provisions.findUnique({
                    where: { id: parseInt(benefit) },
                });

                if (!provisionExists) {
                    res.status(404).json({ error: 'Prestación no encontrada' });
                    return;
                }
            }



            await prisma.participant_provision.createMany({
                data: benefits.map(benefit => ({
                    participant_id: parseInt(participant_id),
                    provision_id: parseInt(benefit),
                    date,
                    turn
                }))
            });

            res.send('Prestaciones entregadas correctamente');

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async deleteDeliveredBenefits(req: Request, res: Response) {

        const benefits = req.body;
        
        console.log(benefits);
        try {
            
            await prisma.participant_provision.deleteMany({
                where: {
                    id: {
                        in: benefits.map(benefit => parseInt(benefit))
                    }
                }
            });

            res.send('Prestaciones eliminadas correctamente');

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async updateDeliveredBenefit(req: Request, res: Response) {

        const {id} = req.params;
        const { date, turn, provision_id } = req.body;

        try {
            
            const participant_provision = await prisma.participant_provision.findUnique({
                where: { id: parseInt(id) }
            });

            if (!participant_provision) {
                res.status(404).json({ error: 'Relación no encontrado' });
                return;
            }

            const provisionExists = await prisma.provisions.findUnique({
                where: { id: parseInt(provision_id) }
            });

            if (!provisionExists) {
                res.status(404).json({ error: 'Prestación no encontrada' });
                return;
            }

            await prisma.participant_provision.updateMany({
                where: {
                    id: parseInt(id),
                },
                data: {
                    date,
                    turn,
                    provision_id: parseInt(provision_id)
                }
            });

            res.send('Prestación actualizada correctamente');

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getParticipantResidences(req: Request, res: Response) {
        
        const { id } = req.params;

        try {
            
            const participant = await prisma.participants.findUnique({
                where: { id: parseInt(id) },
                include: {
                    residences: {
                        include: {
                            residences: true
                        }
                    }
                }
            });

            if (!participant) {
                res.status(404).json({ error: 'Participante no encontrado' });
                return;
            }

            const detailedResidences = participant.residences.map(residence => ({
                id: residence.id,
                admission_date: residence.admission_date,
                departure_date: residence.departure_date,
                status: residence.status,
                admission_notes: residence.admission_notes,
                departure_notes: residence.departure_notes,
                residence: residence.residences
            }));



            res.status(200).json(detailedResidences);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
}