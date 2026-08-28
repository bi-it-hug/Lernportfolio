db = db.getSiblingDB('carCards');
db.createCollection('car');

db.car.insertMany([
    {
        "imageUrl": "images/Auto.png",
        "tradeName": "Audi",
        "model": "Flaschback 300",
        "prize": 50000
    },
    {
        "imageUrl": "images/Auto.png",
        "tradeName": "Opel",
        "model": "Manta SE",
        "prize": 20000
    },
    {
        "imageUrl": "images/Auto.png",
        "tradeName": "VW",
        "model": "Golf GL",
        "prize": 12000
    },
    {
        "imageUrl": "images/Auto.png",
        "tradeName": "Fiat",
        "model": "500",
        "prize": 15000
    }
])
