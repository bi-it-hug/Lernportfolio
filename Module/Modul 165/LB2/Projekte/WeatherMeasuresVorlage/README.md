### 1. Compose File erstellt:

**[docker-compose.yml](docker-compose.yml)**

```yml
services:
    mongo:
        image: mongo
        container_name: mongo
        restart: always
        ports:
            - 27017:27017
        environment:
            MONGO_INITDB_ROOT_USERNAME: root
            MONGO_INITDB_ROOT_PASSWORD: example

    mongo-express:
        image: mongo-express
        container_name: mongo-express
        restart: always
        ports:
            - 8081:8081
        environment:
            ME_CONFIG_MONGODB_ADMINUSERNAME: root
            ME_CONFIG_MONGODB_ADMINPASSWORD: example
            ME_CONFIG_MONGODB_URL: mongodb://root:example@mongo:27017/
            ME_CONFIG_BASICAUTH: false
```

### 2. Code Erklärung

- **Zeile 19**: `Hello Weather` wird in die Konsole geschrieben
- **Zeile 22**: Der Connection String wird definiert
- **Zeile 23**: Die Verbindung zur Datenbank wird aufgebaut
- **Zeile 26 - 27**: Der Inhalt aller Datenbanken wird in die Konsole geschrieben

### 3. Datenbank `weathermeasuredb` mit Compass erstellt

### 4. Neues Dokument erstellt

![alt text](image.png)

![alt text](image-1.png)
