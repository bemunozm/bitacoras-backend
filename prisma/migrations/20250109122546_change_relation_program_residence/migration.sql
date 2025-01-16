/*
  Warnings:

  - Added the required column `residence_id` to the `programs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bitacoras" DROP CONSTRAINT "bitacoras_residence_id_fkey";

-- AlterTable
ALTER TABLE "programs" ADD COLUMN     "residence_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_residence_id_fkey" FOREIGN KEY ("residence_id") REFERENCES "residences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
