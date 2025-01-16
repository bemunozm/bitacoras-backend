/*
  Warnings:

  - You are about to drop the column `coordinator` on the `programs` table. All the data in the column will be lost.
  - Added the required column `coordinator_id` to the `programs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "programs" DROP CONSTRAINT "programs_coordinator_fkey";

-- AlterTable
ALTER TABLE "programs" DROP COLUMN "coordinator",
ADD COLUMN     "coordinator_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_coordinator_id_fkey" FOREIGN KEY ("coordinator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
