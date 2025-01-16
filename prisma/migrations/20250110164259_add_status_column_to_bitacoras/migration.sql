/*
  Warnings:

  - You are about to drop the column `approved` on the `bitacoras` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `bitacoras` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "activity_attachment" DROP CONSTRAINT "activity_attachment_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_attachment" DROP CONSTRAINT "activity_attachment_attachment_id_fkey";

-- DropForeignKey
ALTER TABLE "residence_user" DROP CONSTRAINT "residence_user_residence_id_fkey";

-- DropForeignKey
ALTER TABLE "residence_user" DROP CONSTRAINT "residence_user_user_id_fkey";

-- AlterTable
ALTER TABLE "bitacoras" DROP COLUMN "approved",
DROP COLUMN "completed",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'En Progreso';

-- AddForeignKey
ALTER TABLE "residence_user" ADD CONSTRAINT "residence_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residence_user" ADD CONSTRAINT "residence_user_residence_id_fkey" FOREIGN KEY ("residence_id") REFERENCES "residences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_attachment" ADD CONSTRAINT "activity_attachment_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_attachment" ADD CONSTRAINT "activity_attachment_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
