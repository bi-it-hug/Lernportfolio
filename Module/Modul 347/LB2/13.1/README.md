### 3.1: Basis Datei

```yml
# Use root/example as user/password credentials

services:
    db:
        image: mariadb
        restart: always
        environment:
            MARIADB_ROOT_PASSWORD: example

    adminer:
        image: adminer
        restart: always
        ports:
            - 8080:8080
```

### 3.2: Compose mit SQL-Dump

```yml
# Use root/example as user/password credentials

services:
    db:
        image: mariadb
        restart: always
        environment:
            MARIADB_ROOT_PASSWORD: example
        volumes:
            - ./dump.sql:/docker-entrypoint-initdb.d/dump.sql
        ports:
            - 3306:3306

    adminer:
        image: adminer
        restart: always
        ports:
            - 8080:8080
```

### 3.3: Compose mit Logindaten

```yml
# Use root/example as user/password credentials

services:
    db:
        image: mariadb
        restart: always
        environment:
            MARIADB_ROOT_PASSWORD: example
            MARIADB_USER: myapp
            MARIADB_PASSWORD: 123456
            MARIADB_DATABASE: MyDatabase
        volumes:
            - ./dump.sql:/docker-entrypoint-initdb.d/dump.sql
        ports:
            - 3306:3306

    adminer:
        image: adminer
        restart: always
        ports:
            - 8080:8080
```
