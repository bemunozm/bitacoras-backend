import { PrismaClient } from '@prisma/client';
import { CronJob } from 'cron';
import {v2 as cloudinary} from 'cloudinary';

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

// Funcion para eliminar bitacoras con mas de 6 meses de antiguedad
async function deleteOldBitacoras() {
  try {
    const oldBitacoras = await prisma.bitacoras.findMany({
      where: {
        month: {
          lt: new Date(new Date().setMonth(new Date().getMonth() - 6)), // Bitácoras con más de 6 meses de antigüedad
        },
      },
    });

    //Borrar actividades asociadas a bitacoras
    for (const bitacora of oldBitacoras) {
      const activities = await prisma.activities.findMany({
        where: {
          bitacora_id: bitacora.id,
        },
      });

      for (const activity of activities) {

        //Borrar imagenes asociadas a actividades
        const attachments = await prisma.attachments.findMany({
          where: {
            activity_id: activity.id,
          },
        });

      if (attachments.length > 0) {
          await prisma.attachments.deleteMany({
              where: {
                  activity_id: Number(activity.id),
              }
          });

          //Eliminar los archivos de Cloudinary
          attachments.forEach((attachment) => {
              cloudinary.uploader.destroy(attachment.image.split('/').pop().split('.')[0]);
          });
      }

        await prisma.activities.delete({
          where: {
            id: activity.id,
          },
        });
      }
    }

    const result = await prisma.bitacoras.deleteMany({
      where: {
        month: {
          lt: new Date(new Date().setMonth(new Date().getMonth() - 6)), // Bitácoras con más de 6 meses de antigüedad
        },
      },
    });
    console.log(`[Cron] ${result.count} bitácoras antiguas eliminadas.`);
  } catch (error) {
    console.error('[Cron] Error eliminando bitácoras antiguas:', error);
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
    '0 0 1 * *', // Ejecutar el día 1 de cada mes a las 00:00
    async () => {
      console.log('[Cron] Iniciando limpieza de bitácoras con antiguedad mayor a 6 meses...');
      await deleteOldBitacoras();
      console.log('[Cron] Limpieza completada.');
    },
    null,
    true, // Inicia automáticamente
    'America/Santiago' // Zona horaria
  );

  console.log('[Cron] Cron jobs inicializados.');
  job.start();
};
