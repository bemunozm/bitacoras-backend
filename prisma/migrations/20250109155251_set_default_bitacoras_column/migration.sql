/*
  Warnings:

  - You are about to drop the column `residence_id` on the `bitacoras` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bitacoras" DROP COLUMN "residence_id",
ALTER COLUMN "completed" SET DEFAULT false,
ALTER COLUMN "approved" SET DEFAULT false;
