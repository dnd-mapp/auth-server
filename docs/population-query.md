
```sql
-- 1. Create database user.
CREATE USER IF NOT EXISTS 'prisma_user'@'%' IDENTIFIED BY 'your_secure_password';


-- 2. Create main database and grant priviledes to created user.
CREATE DATABASE IF NOT EXISTS `my_application`
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON `my_application`.* TO 'prisma_user'@'%';


-- 3. Create shadow database and grant priviledes to created user.
CREATE DATABASE IF NOT EXISTS `my_application_shadow` 
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON `my_application_shadow`.* TO 'prisma_user'@'%';


-- 4. Apply privileges.
FLUSH PRIVILEGES;
```
