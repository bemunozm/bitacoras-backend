import type { Request, Response } from 'express';
import prisma from '../config/db';

export class ProgramController {

    static async createProgram(req: Request, res: Response) {
        
        const { name, company, address, state, coordinator_id, residences } = req.body;

        try {
            
            await prisma.programs.create({
                data: {
                    name,
                    company,
                    address,
                    state,
                    coordinator_id,
                    residences: {
                        createMany: {
                            data: residences.map(residence => ({
                                residence_id: residence
                            }))
                        }}
                }
            });

            res.send('Programa creado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        
    }

    static async getPrograms(req: Request, res: Response) {

        try {

            const programs = await prisma.programs.findMany({
                include: {
                    coordinator: true,
                    residences: {
                        include: {
                            residences: true
                        }
                    }
                }
            });

            const programsWithResidences = programs.map(program => {
                return {
                    ...program,
                    residences: program.residences.map(residence => residence.residences)
                }
            });
            

            res.status(200).json(programsWithResidences);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
            
        }

    }

    static async getProgram(req: Request, res: Response) {

        const { id } = req.params;

        try {
            
            const program = await prisma.programs.findUnique({
                where: { id: parseInt(id) },
                include: {
                    coordinator: true,
                    residences: {
                        include: {
                            residences: true
                        }
                }}
            });

            const programWithResidences = {
                ...program,
                residences: program.residences.map(residence => residence.residences)
            }
            

            if (!program) {
                res.status(404).json({ error: 'Programa no encontrado' });
                return;
            }

            res.status(200).json(programWithResidences);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async updateProgram(req: Request, res: Response) {

        const { id } = req.params;
        const { name, company, address, state, coordinator_id, residences } = req.body;

        try {
            
            // Obtener residencias actuales del programa
            const currentResidences = await prisma.program_residence.findMany({
                where: {
                    program_id: Number(id)
                }
            });

            //Comparar para ver si hay residencias que eliminar
            const residencesToDelete = currentResidences.filter(currentResidence => !residences.includes(currentResidence.residence_id));

            const residencesToCreate = residences.filter(residence => !currentResidences.map(currentResidence => currentResidence.residence_id).includes(residence));

            //Eliminar las residencias que no estén en la lista de roles
            await prisma.program_residence.deleteMany({
                where: {
                    program_id: Number(id),
                    residence_id: {
                        in: residencesToDelete.map(residence => residence.residence_id)
                    }
                }
            });
    
            // Luego, actualizar el usuario con los nuevos roles
            await prisma.programs.update({
                where: {
                    id: Number(id)
                },
                data: {
                    name,
                    company,
                    address,
                    state,
                    coordinator_id,
                    residences: {
                        createMany: {
                            data: residencesToCreate.map(residence => ({
                                residence_id: residence // Asociar los roles nuevos
                            }))
                        }
                    }
                }
            });

            res.send('Programa actualizado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async deleteProgram(req: Request, res: Response) {

        const { id } = req.params;

        try {
            
            await prisma.programs.delete({
                where: { id: parseInt(id) }
            });

            res.send('Programa eliminado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
}