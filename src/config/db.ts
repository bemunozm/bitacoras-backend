import { PrismaClient } from '@prisma/client';
import colors from 'colors';
import { exit } from 'node:process';

// Aseguramos que PrismaClient sea singleton
let prisma: PrismaClient;

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: ['query'],
  });
}

prisma = global.prisma;

// Función para conectar a la base de datos
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(colors.magenta.bold('Prisma conectado a la base de datos'));
  } catch (error) {
    console.log(colors.red.bold('Error al conectar a la base de datos'));
    exit(1);
  }
};

// Cerramos la conexión al salir
process.on('SIGINT', async () => {
  console.log(colors.yellow.bold('Desconectando Prisma...'));
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
