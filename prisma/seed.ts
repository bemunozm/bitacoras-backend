import { PrismaClient } from '@prisma/client';
import { users } from './data/users';
import { generateToken } from '../src/utils/token';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  try {
    
    users.map(async (user) => {

        const generatedPassword = generateToken()
        
        const createdUser = await prisma.users.create({
            data: {
          ...user,
          password: await hashPassword(generatedPassword),
            },
        })

        await prisma.role_user.create({
            data: {
                role_id: 3,
                user_id: createdUser.id
            }
        })
    },)
    
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