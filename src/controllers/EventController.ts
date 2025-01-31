import type { Request, Response } from 'express';
import prisma from "../config/db";

export class EventController {

    static async createEvent(req: Request, res: Response) {
        try {
            const { date, description, type, participant_id } = req.body;

            const event = await prisma.events.create({
                data: {
                    date,
                    description,
                    type,
                    participant_id
                }
            });

            res.send('Evento registrado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getEvents(req: Request, res: Response) {
        try {
            const events = await prisma.events.findMany({
                include: {
                    participant: true
                }
            });
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getEvent(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const event = await prisma.events.findUnique({
                where: { id: parseInt(id) },
                include: {
                    participant: true
                }
            });

            if (!event) {
                res.status(404).json({ error: 'Evento no encontrado' });
                return;
            }

            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateEvent(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const event = await prisma.events.update({
                where: { id: parseInt(id) },
                data: req.body
            });

            res.send('Evento actualizado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteEvent(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.events.delete({
                where: { id: parseInt(id) }
            });

            res.status(200).send('Evento eliminado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getEventsByParticipant(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const events = await prisma.events.findMany({
                where: { participant_id: parseInt(id) }
            });

            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
