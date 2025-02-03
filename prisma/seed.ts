import { PrismaClient } from '@prisma/client';
import { diseases } from './data/diseases';

const prisma = new PrismaClient();

async function main() {
  try {

    
    await prisma.diseases.createMany({
        data: diseases
    })
    
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