CREATE TABLE `tasks` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `completed` tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
);

INSERT INTO
    `tasks`
VALUES 
    (1, 'Backup erschießen', 0),
    (2, 'Kinder deployen', 0),
    (3, 'Scheiße frittieren', 0);