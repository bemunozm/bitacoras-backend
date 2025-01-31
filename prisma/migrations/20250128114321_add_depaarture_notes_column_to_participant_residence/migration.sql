/*
  Warnings:

  - You are about to drop the column `notes` on the `participant_residence` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "participant_residence" DROP COLUMN "notes",
ADD COLUMN     "admission_notes" TEXT,
ADD COLUMN     "departure_notes" TEXT;
