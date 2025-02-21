/*
  Warnings:

  - You are about to alter the column `recipe` on the `bitacoras` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `bitacoras` MODIFY `recipe` INTEGER NULL;
