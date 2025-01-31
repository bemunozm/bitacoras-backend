import type { Request, Response } from 'express';
import prisma from "../config/db";

export class ProvisionController {

    static async createProvision(req: Request, res: Response) {
        try {
            const { name, description, provision_category_id } = req.body;

            const provision = await prisma.provisions.create({
                data: {
                    name,
                    description,
                    provision_category_id
                }
            });

            res.send('Provisión registrada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProvisions(req: Request, res: Response) {
        try {
            const provisions = await prisma.provisions.findMany({
                include: {
                    category: true
                }
            });
            res.status(200).json(provisions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProvision(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const provision = await prisma.provisions.findUnique({
                where: { id: parseInt(id) },
                include: {
                    category: true
                }
            });

            if (!provision) {
                res.status(404).json({ error: 'Provisión no encontrada' });
                return;
            }

            res.status(200).json(provision);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateProvision(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const provision = await prisma.provisions.update({
                where: { id: parseInt(id) },
                data: req.body
            });

            res.send('Provisión actualizada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteProvision(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.provisions.delete({
                where: { id: parseInt(id) }
            });

            res.status(200).send('Provisión eliminada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProvisionsAssignedByDate(req: Request, res: Response) {
        const { date, turn } = req.params;
        try {
            const provisions = await prisma.participant_provision.findMany({
                where: {
                    date: {
                        gte: new Date(new Date(date).setUTCHours(0, 0, 0, 0)),
                        lt: new Date(new Date(date).setUTCHours(23, 59, 59, 999))
                    },
                    turn
                },
                include: {
                    provision: {
                        include: {
                            category: true
                        }
                    },
                    participant: {
                        include: {
                            diseases: {
                                include: {
                                    diseases: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    created_at: 'asc'
                }
            });

            const groupedProvisions = provisions.reduce((acc: any, provision) => {
                const participantId = provision.participant.id;
                if (!acc[participantId]) {
                    acc[participantId] = {
                        participant: {
                            ...provision.participant,
                            diseases: provision.participant.diseases.map(disease => disease.diseases)
                        },
                        provisions: []
                    };
                }
                acc[participantId].provisions.push({
                    id: provision.provision.id, // Include the provision id
                    pivotId: provision.id, // Include the pivot table id
                    ...provision.provision,
                    category: provision.provision.category
                });
                return acc;
            }, {});

            const formattedData = Object.values(groupedProvisions).map((group: any) => ({
                participant: group.participant,
                provisions: group.provisions
            }));
            
            res.status(200).json(formattedData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProvisionsByParticipant(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const provisions = await prisma.participant_provision.findMany({
                where: {
                    participant_id: parseInt(id)
                },
                include: {
                    provision: {
                        include: {
                            category: true
                        }
                    }
                }
            });

            res.status(200).json(provisions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getDeliveredBenefit(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const deliveredBenefit = await prisma.participant_provision.findUnique({
                where: {
                    id: parseInt(id),
                }
            });

            res.status(200).json(deliveredBenefit);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
