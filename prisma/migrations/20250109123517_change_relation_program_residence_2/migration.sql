/*
  Warnings:

  - You are about to drop the column `residence_id` on the `programs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "programs" DROP CONSTRAINT "programs_residence_id_fkey";

-- AlterTable
ALTER TABLE "programs" DROP COLUMN "residence_id";

-- CreateTable
CREATE TABLE "program_residence" (
    "id" SERIAL NOT NULL,
    "program_id" INTEGER NOT NULL,
    "residence_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_residence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "program_residence" ADD CONSTRAINT "program_residence_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_residence" ADD CONSTRAINT "program_residence_residence_id_fkey" FOREIGN KEY ("residence_id") REFERENCES "residences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
