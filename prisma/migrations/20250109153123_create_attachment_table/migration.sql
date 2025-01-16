/*
  Warnings:

  - You are about to drop the column `bitacora_id` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `attachments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_bitacora_id_fkey";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "bitacora_id",
DROP COLUMN "description";

-- CreateTable
CREATE TABLE "activity_attachment" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "attachment_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_attachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activity_attachment" ADD CONSTRAINT "activity_attachment_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_attachment" ADD CONSTRAINT "activity_attachment_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
