import { PrismaClient } from '@prisma/client';
import { users } from './data/users';
import { generateToken } from '../src/utils/token';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  try {

    let defaultRole = await prisma.roles.findFirst({
        where: {
            name: 'Usuario'
        }
    })

    if(!defaultRole) {
       defaultRole = await prisma.roles.create({
            data: {
                name: 'Usuario'
            }
        })
    }

    for (const user of users) {

        const password = generateToken()
        const hashedPassword = await hashPassword(password)

        const createdUser = await prisma.users.create({
            data: {
                ...user,
                password: hashedPassword,
            }
        });

        // Insertar la relación en role_user
        await prisma.role_user.create({
            data: {
                user_id: createdUser.id, // ID del usuario recién creado
                role_id: defaultRole.id, // ID del rol por defecto
            },
        });
    }
    
  } catch (error) {
    console.log(error)
  }
}

main()
    .then( async () => {
        await prisma.$disconnect()
    })
    .catch( async (e) => {
        console.error(e)
        await prisma.$disconnect()
    })