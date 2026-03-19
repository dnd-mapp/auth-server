/*
  Warnings:

  - You are about to drop the column `removedAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `removedAt`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;
