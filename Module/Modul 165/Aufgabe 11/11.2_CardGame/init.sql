drop database if exists  carCards;
create database carCards;
use carCards;

create table car (
    id int not null auto_increment primary key,
    imageUrl text not null,
    tradeName text not null,
    model text not null,
    prize double
);

insert into car (imageUrl, tradeName, model, prize) VALUES ('images/Auto.png', 'Audi', 'Flaschback 300', 50000.00);
insert into car (imageUrl, tradeName, model, prize) VALUES ('images/Auto.png', 'Opel', 'Manta SE', 20000.00);
insert into car (imageUrl, tradeName, model, prize) VALUES ('images/Auto.png', 'VW', 'Golf GL', 12000.00);
insert into car (imageUrl, tradeName, model, prize) VALUES ('images/Auto.png', 'Fiat', '500', 15000.00);

-- ignorieren Sie diese Zeile Für Aufgabe 1
ALTER USER 'root'@'localhost' IDENTIFIED  WITH mysql_native_password BY 'root';