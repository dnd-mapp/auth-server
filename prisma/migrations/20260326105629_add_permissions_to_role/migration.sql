-- CreateTable
CREATE TABLE `role_permissions` (
    `role_id` VARCHAR(191) NOT NULL,
    `permission_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`role_id`, `permission_id`),
    CONSTRAINT `fk_role_permission` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_permission_role` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
