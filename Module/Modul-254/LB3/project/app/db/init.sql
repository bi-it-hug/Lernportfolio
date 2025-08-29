USE `lb3`;

SET
    NAMES utf8mb4;

SET
    CHARACTER SET utf8mb4;

SET
    collation_connection = 'utf8mb4_general_ci';

CREATE TABLE `tasks` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `completed` tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

INSERT INTO
    `tasks`
VALUES
    (1, 'Backup erschießen', 0),
    (2, 'Kinder deployen', 0),
    (3, 'Scheiße frittieren', 0);