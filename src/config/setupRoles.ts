import prisma from "./db";
import colors from 'colors';

const roles = [
    {name: 'Administrador'},
    {name: 'Coordinador'},
    {name: 'Usuario'},
    {name: 'Auditor'},
    {name: 'Monitor'}
]

export async function setupRoles() {
    try {
        for (const role of roles) {
            const existingRole = await prisma.roles.findFirst({
                where: {
                    name: role.name
                }
            });
            if(!existingRole) {
                await prisma.roles.create({
                    data: role
                });
                console.log(colors.green.bold(`Rol ${role.name} creado`));
            } else {
                console.log(colors.yellow.bold(`Rol ${role.name} ya existe`));
            }	
        }
    } catch (error) {
        console.error(colors.red.bold("Error configurando roles por defecto:"), error);
    }
}