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

async function expiredParticipants() {
  try {

    const result = await prisma.participant_residence.updateMany({
      where: {
        departure_date: {
          lt: new Date(), // Tokens que ya expiraron
        },
      },
      data: {
        status: 'Pendiente de Salida',
      },
    });

    console.log(`[Cron] ${result.count} nuevos participantes pendientes de salida.`);
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

  const job2 = new CronJob(
    '0 0 * * *', // Ejecutar cada día a la medianoche
    async () => {
      console.log('[Cron] Verificando participantes expirados...');
      await expiredParticipants();
      console.log('[Cron] Verificación completada.');
    },
    null,
    true, // Inicia automáticamente
    'America/Santiago' // Zona horaria
  );

  console.log('[Cron] Cron jobs inicializados.');
  job.start();
  job2.start();
};
