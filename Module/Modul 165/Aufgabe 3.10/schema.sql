USE KollegiumDB;

CREATE TABLE Kollegium1 (
    Name VARCHAR(50),
    Bistro VARCHAR(50)
);

CREATE TABLE Kollegium2 (
    Name VARCHAR(50),
    Bistro VARCHAR(50)
);

CREATE TABLE Angebot (
    Bistro VARCHAR(50),
    Getraenk VARCHAR(50)
);

CREATE TABLE Vorliebe (
    Name VARCHAR(50),
    Getraenk VARCHAR(50)
);