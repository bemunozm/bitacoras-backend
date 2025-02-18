/*
  Warnings:

  - You are about to drop the column `coordinator_id` on the `programs` table. All the data in the column will be lost.
  - You are about to drop the `disease_participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diseases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `participant_provision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `participant_residence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `program_residence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `provision_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `provisions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `residence_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `residences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `disease_participant` DROP FOREIGN KEY `disease_participant_disease_id_fkey`;

-- DropForeignKey
ALTER TABLE `disease_participant` DROP FOREIGN KEY `disease_participant_participant_id_fkey`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_participant_id_fkey`;

-- DropForeignKey
ALTER TABLE `participant_provision` DROP FOREIGN KEY `participant_provision_participant_id_fkey`;

-- DropForeignKey
ALTER TABLE `participant_provision` DROP FOREIGN KEY `participant_provision_provision_id_fkey`;

-- DropForeignKey
ALTER TABLE `participant_residence` DROP FOREIGN KEY `participant_residence_participant_id_fkey`;

-- DropForeignKey
ALTER TABLE `participant_residence` DROP FOREIGN KEY `participant_residence_residence_id_fkey`;

-- DropForeignKey
ALTER TABLE `program_residence` DROP FOREIGN KEY `program_residence_program_id_fkey`;

-- DropForeignKey
ALTER TABLE `program_residence` DROP FOREIGN KEY `program_residence_residence_id_fkey`;

-- DropForeignKey
ALTER TABLE `programs` DROP FOREIGN KEY `programs_coordinator_id_fkey`;

-- DropForeignKey
ALTER TABLE `provisions` DROP FOREIGN KEY `provisions_provision_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `residence_user` DROP FOREIGN KEY `residence_user_residence_id_fkey`;

-- DropForeignKey
ALTER TABLE `residence_user` DROP FOREIGN KEY `residence_user_user_id_fkey`;

-- DropIndex
DROP INDEX `programs_coordinator_id_fkey` ON `programs`;

-- AlterTable
ALTER TABLE `programs` DROP COLUMN `coordinator_id`;

-- DropTable
DROP TABLE `disease_participant`;

-- DropTable
DROP TABLE `diseases`;

-- DropTable
DROP TABLE `events`;

-- DropTable
DROP TABLE `participant_provision`;

-- DropTable
DROP TABLE `participant_residence`;

-- DropTable
DROP TABLE `participants`;

-- DropTable
DROP TABLE `program_residence`;

-- DropTable
DROP TABLE `provision_categories`;

-- DropTable
DROP TABLE `provisions`;

-- DropTable
DROP TABLE `residence_user`;

-- DropTable
DROP TABLE `residences`;

-- CreateTable
CREATE TABLE `program_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `program_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `turn` VARCHAR(191) NOT NULL,
    `is_coordinator` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `program_user` ADD CONSTRAINT `program_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_user` ADD CONSTRAINT `program_user_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
