/*
  Warnings:

  - You are about to drop the `activity_attachment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `activity_id` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activity_attachment" DROP CONSTRAINT "activity_attachment_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_attachment" DROP CONSTRAINT "activity_attachment_attachment_id_fkey";

-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "activity_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "activity_attachment";

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
