-- Adminer 5.2.1 MariaDB 11.5.2-MariaDB-ubu2404 dump
SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `${DB_NAME}`
/*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON `${DB_NAME}`.* TO '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
FLUSH PRIVILEGES;

USE `${DB_NAME}`;

-- 2025-05-15 13:29:52 UTC