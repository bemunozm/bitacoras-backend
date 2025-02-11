-- AlterTable
ALTER TABLE `activities` MODIFY `description` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `categories` MODIFY `description` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `diseases` MODIFY `description` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `events` MODIFY `description` LONGTEXT NOT NULL;
