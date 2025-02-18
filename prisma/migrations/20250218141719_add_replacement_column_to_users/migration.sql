-- AlterTable
ALTER TABLE `users` ADD COLUMN `is_replacement` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;
