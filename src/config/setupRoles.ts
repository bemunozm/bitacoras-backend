import prisma from "./db";
import colors from 'colors';

/**
 * Definición de roles por defecto del sistema
 * Estos roles son fundamentales para el funcionamiento de la aplicación
 * y se crean automáticamente al iniciar el servidor
 */
const roles = [
    {name: 'Administrador'}, // Acceso total al sistema
    {name: 'Coordinador'},   // Gestión de programas, bitacoras y remplazos
    {name: 'Usuario'},       // Acceso básico y gestión de bitácoras
    {name: 'Administrativo'} // Diferenciador en el tipo de informe que se genera
]

/**
 * Configura los roles por defecto en la base de datos
 * Verifica la existencia de cada rol y los crea si no existen
 * @returns Promise<void>
 */
export async function setupRoles() {
    try {
        // Iterar sobre cada rol definido
        for (const role of roles) {
            // Verificar si el rol ya existe en la base de datos
            const existingRole = await prisma.roles.findFirst({
                where: {
                    name: role.name
                }
            });

            // Si el rol no existe, crearlo
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