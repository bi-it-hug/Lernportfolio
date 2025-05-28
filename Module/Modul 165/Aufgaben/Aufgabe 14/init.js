db = db.getSiblingDB('jokesdb');

db.createCollection('jokes');

db.jokes.insertMany([
    {
        "id": 1,
        "text": 'Kunde: "Ich möchte Ihren Chef sprechen!"\r\nSekretärin: "Geht leider nicht, er ist nicht da!"\r\nKunde: "Ich hab ihn doch durchs Fenster gesehen!"\r\nSekretärin: "Er Sie auch!"',
        "rating": 5,
        "date": '2022-01-08 21:39:40'
    },
    {
        "id": 2,
        "text": 'Der Verwaltungsrat zum CEO:\r\n"Na, wie macht sich denn der neue Buchhalter?"\r\nCEO: "Toll, dieser Mann!"\r\nVerwaltungsrat: "Was kann er denn so besonderes?"\r\nCEO: "Er ist gelernter Friseur, er kann frisieren!"',
        "rating": 3,
        "date": '2022-01-08 21:42:41'
    },
    {
        "id": 3,
        "text": 'Chef: "Müller, Sie sind das beste Pferd in meinem Stall!"\r\nMüller: "Wirklich, Chef?"\r\nChef: "Ja, Sie machen den meisten Mist!"',
        "rating": 5,
        "date": '2022-01-08 21:43:20'
    },
    {
        "id": 4,
        "text": 'Was sagt ein Schneider zu einem losen Knopf? – "Was geht so ab?"',
        "rating": 3,
        "date": '2022-28-09 19:38:10'
    },
    {
        "id": 5,
        "text": 'Wie viele Informatiker braucht es um eine Glühbirne zuw wechseln? - Keine! Nicht mein Bereich!',
        "rating": 10,
        "date": '2025-15-05 10:53:59'
    }
]);
