/*
  Warnings:

  - Added the required column `coordinator` to the `programs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "programs" ADD COLUMN     "coordinator" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_coordinator_fkey" FOREIGN KEY ("coordinator") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
