import type { Request, Response } from 'express';
import prisma from '../config/db';

/**
 * Controlador para manejar todas las operaciones relacionadas con roles
 * Gestiona la creación, consulta, actualización y eliminación de roles del sistema,
 * asegurando la integridad de las asignaciones de roles a usuarios
 */
export class RoleController {
    /**
     * Crea un nuevo rol en el sistema
     * @param req.body.name Nombre del rol a crear
     * @returns Mensaje de confirmación de creación
     * @throws Error si ya existe un rol con el mismo nombre
     */
    static async createRole(req: Request, res: Response) : Promise<void> {
        try {
            // Verificar duplicidad de nombre
            const roleExists = await prisma.roles.findFirst({
                where: { name: req.body.name }
            });

            if (roleExists) {
                res.status(400).json({ error: 'El rol ya existe' });
                return;
            }

            // Crear el nuevo rol
            await prisma.roles.create({
                data: req.body
            });

            res.send('Rol creado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Obtiene todos los roles del sistema
     * @returns Lista de roles registrados
     */
    static async getRoles(req: Request, res: Response) {
        try {
            const roles = await prisma.roles.findMany();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Obtiene un rol específico por su ID
     * @param req.params.id ID del rol
     * @returns Detalles del rol solicitado
     * @throws Error si el rol no existe
     */
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

    /**
     * Actualiza la información de un rol
     * @param req.params.id ID del rol a actualizar
     * @param req.body.name Nuevo nombre del rol
     * @returns Mensaje de confirmación de actualización
     * @throws Error si el rol no existe o si el nuevo nombre ya está en uso
     */
    static async updateRole(req: Request, res: Response) {
        const { id } = req.params;

        try {
            // Verificar existencia del rol
            const role = await prisma.roles.findUnique({
                where: { id: parseInt(id) }
            });

            if (!role) {
                res.status(404).json({ error: 'Rol no encontrado' });
                return;
            }

            // Verificar duplicidad de nombre excluyendo el rol actual
            const roleExists = await prisma.roles.findFirst({
                where: { 
                    name: req.body.name, 
                    id: { not: parseInt(id) } 
                }
            });

            if (roleExists) {
                res.status(400).json({ error: 'Ya existe otro rol con este nombre' });
                return;
            }

            // Actualizar el rol
            await prisma.roles.update({
                where: { id: parseInt(id) },
                data: req.body
            });

            res.send('Rol actualizado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Elimina un rol del sistema
     * @param req.params.id ID del rol a eliminar
     * @returns Mensaje de confirmación de eliminación
     * @throws Error si el rol no existe o está siendo utilizado por usuarios
     */
    static async deleteRole(req: Request, res: Response) {
        const { id } = req.params;

        try {
            // Verificar existencia del rol
            const role = await prisma.roles.findUnique({
                where: { id: parseInt(id) }
            });

            if (!role) {
                res.status(404).json({ error: 'Rol no encontrado' });
                return;
            }

            // Verificar que el rol no esté asignado a ningún usuario
            const roleInUse = await prisma.role_user.findFirst({
                where: { role_id: parseInt(id) }
            });

            if (roleInUse) {
                res.status(400).json({ error: 'No se puede eliminar el rol porque está asignado a uno o más usuarios' });
                return;
            }

            // Eliminar el rol
            await prisma.roles.delete({
                where: { id: parseInt(id) }
            });

            res.send('Rol eliminado correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}