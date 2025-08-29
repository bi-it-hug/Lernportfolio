USE KollegiumDB;

-- (a) Alle Kolleginnen und Kollegen beider Schulen mit den bevorzugten Bistros
SELECT
    Name,
    Bistro
FROM
    Kollegium1
UNION
SELECT
    Name,
    Bistro
FROM
    Kollegium2;

-- (b) Alle Bistros, die Anna gerne besucht
SELECT
    Bistro
FROM
    Kollegium1
WHERE
    Name = 'Anna';

-- (c) Personen aus Kollegium2, die nicht in Kollegium1 vorkommen
SELECT
    Name
FROM
    Kollegium2
WHERE
    Name NOT IN (
        SELECT
            Name
        FROM
            Kollegium1
    );

-- (d) Namensliste von Kollegium1
SELECT
    DISTINCT Name
FROM
    Kollegium1;

-- (e) Namensliste der Kollegen, die in beiden Schulen unterrichten
SELECT
    DISTINCT k1.Name
FROM
    Kollegium1 k1
    INNER JOIN Kollegium2 k2 ON k1.Name = k2.Name;

-- (f) Alle möglichen Bistrobesuche der Lehrkräfte der ersten Schule
SELECT
    DISTINCT k1.Name,
    a.Bistro
FROM
    Kollegium1 k1
    CROSS JOIN Angebot a;

-- (g) Welche Getränke die Lehrkräfte der ersten Schule in bevorzugten Bistros trinken können
SELECT
    DISTINCT k1.Name,
    a.Getraenk
FROM
    Kollegium1 k1
    JOIN Angebot a ON k1.Bistro = a.Bistro;

-- (h) Getränke, die Lehrkräfte der ersten Schule trinken können (auch alle möglichen)
SELECT
    DISTINCT k1.Name,
    a.Getraenk
FROM
    Kollegium1 k1
    JOIN Angebot a ON k1.Bistro = a.Bistro
UNION
SELECT
    DISTINCT k1.Name,
    a.Getraenk
FROM
    Kollegium1 k1
    CROSS JOIN Angebot a;