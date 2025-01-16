import { PrismaClient } from '@prisma/client';
import { CronJob } from 'cron';

const prisma = new PrismaClient();

// Función para eliminar tokens expirados
async function deleteExpiredTokens() {
  try {
    const result = await prisma.tokens.deleteMany({
      where: {
        expires_at: {
          lt: new Date(), // Tokens que ya expiraron
        },
      },
    });
    console.log(`[Cron] ${result.count} tokens expirados eliminados.`);
  } catch (error) {
    console.error('[Cron] Error eliminando tokens expirados:', error);
  }
}

// Configuración del cron job
export const startCronJobs = () => {
  const job = new CronJob(
    '0 * * * *', // Ejecutar cada hora al minuto 0
    async () => {
      console.log('[Cron] Iniciando limpieza de tokens expirados...');
      await deleteExpiredTokens();
      console.log('[Cron] Limpieza completada.');
    },
    null,
    true, // Inicia automáticamente
    'America/Santiago' // Zona horaria
  );

  console.log('[Cron] Cron jobs inicializados.');
  job.start();
};
