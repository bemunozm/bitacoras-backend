import type { Request, Response } from "express";
import prisma from "../config/db";

export class ProgramController {
  static async createProgram(req: Request, res: Response) {
    const { name, company, address, state, coordinator_id } = req.body;

    try {
      const coordinatorExists = await prisma.users.findFirst({
        where: { id: coordinator_id },
        include: {
          roles: {
            include: {
              roles: true,
            },
          },
        },
      });

      if (
        !coordinatorExists ||
        !coordinatorExists.roles.some(
          (role) => role.roles.name === "Coordinador"
        )
      ) {
        res
          .status(400)
          .json({
            error: "El coordinador no existe o no tiene el rol de Coordinador",
          });
        return;
      }

      const programExists = await prisma.programs.findFirst({
        where: { name, company, address, state },
      });

      if (programExists) {
        res.status(400).json({ error: "El programa ya existe" });
        return;
      }

      await prisma.programs.create({
        data: {
          name,
          company,
          address,
          state,
          users: {
            create: {
              user_id: coordinator_id,
              is_coordinator: true,
              turn: null,
            },
          },
        },
      });

      res.send("Programa creado correctamente");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPrograms(req: Request, res: Response) {
    try {
      const programs = await prisma.programs.findMany({
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      });

      res.status(200).json(programs);
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
          users: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!program) {
        res.status(404).json({ error: "Programa no encontrado" });
        return;
      }

      res.status(200).json(program);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProgram(req: Request, res: Response) {
    const { id } = req.params;
    const { name, company, address, state, coordinator_id } = req.body;

    try {
      const coordinatorExists = await prisma.users.findFirst({
        where: { id: coordinator_id },
        include: {
          roles: {
            include: {
              roles: true,
            },
          },
        },
      });

      if (
        !coordinatorExists ||
        !coordinatorExists.roles.some(
          (role) => role.roles.name === "Coordinador"
        )
      ) {
        res
          .status(400)
          .json({
            error: "El coordinador no existe o no tiene el rol de Coordinador",
          });
        return;
      }

      const programExists = await prisma.programs.findFirst({
        where: { name, company, address, state, id: { not: Number(id) } },
      });

      if (programExists) {
        res.status(400).json({ error: "El programa ya existe" });
        return;
      }

      // Luego, actualizar el usuario con los nuevos roles
      await prisma.programs.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          company,
          address,
          state,
          users: {
            deleteMany: { is_coordinator: true }, // Eliminar coordinador anterior
            create: {
              user_id: coordinator_id,
              is_coordinator: true,
              turn: null,
            }, // Asignar nuevo coordinador
          },
        },
      });

      res.send("Programa actualizado correctamente");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteProgram(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const programExists = await prisma.programs.findUnique({
        where: { id: parseInt(id) },
        include: {
          users: true,
        },
      });

      if (!programExists) {
        res.status(404).json({ error: "Programa no encontrado" });
        return;
      }

      const programBitacoras = await prisma.bitacoras.findMany({
        where: { program_id: parseInt(id) },
      });

      if (programBitacoras.length > 0) {
        res
          .status(400)
          .json({
            error:
              "No se puede eliminar el programa porque tiene bitácoras asociadas",
          });
        return;
      }

      if (programExists.users.length > 0) {
        res
          .status(400)
          .json({
            error:
              "No se puede eliminar el programa porque tiene usuarios asociados",
          });
        return;
      }

      await prisma.programs.delete({
        where: { id: parseInt(id) },
      });

      res.send("Programa eliminado correctamente");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async associateUser(req: Request, res: Response) {
    const { program_id, user_id, turn } = req.body;

    try {
      const programExists = await prisma.programs.findUnique({
        where: { id: program_id },
      });

      if (!programExists) {
        res.status(404).json({ error: "Programa no encontrado" });
        return;
      }

      const userExists = await prisma.users.findUnique({
        where: { id: user_id },
      });

      if (!userExists) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      //Verificar que el usuario no esté asociado al programa
      const userProgram = await prisma.program_user.findFirst({
        where: { program_id, user_id },
      });

      if (userProgram) {
        res
          .status(400)
          .json({ error: "El usuario ya está asociado a este programa" });
        return;
      }

      await prisma.program_user.create({
        data: {
          program_id,
          user_id,
          turn,
        },
      });

      res.send("Usuario asociado correctamente");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async disassociateUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const associationExists = await prisma.program_user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!associationExists) {
        res.status(404).json({ error: "Asociación no encontrada" });
        return;
      }

      await prisma.program_user.delete({
        where: {
          id: associationExists.id,
        },
      });

      res.send("Usuario desasociado correctamente");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateAssociation(req: Request, res: Response) {
    const { id } = req.params;
    const { turn } = req.body;

    try {
      
        const currentAssociation = await prisma.program_user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!currentAssociation) {
            res.status(404).json({ error: "Asociación no encontrada" });
            return;
        }

      await prisma.program_user.update({
        where: {
          id: currentAssociation.id,
        },
        data: {
          turn,
        },
      });

      res.send("Asociación actualizada correctamente");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
