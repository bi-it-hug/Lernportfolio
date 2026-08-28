## Aufgabe 4 – Docker-Befehle vertiefen

### Container und ihre IP-Adressen

```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container-name-oder-id>
```

Beispiel:

```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' webserver
```

---

### Container und ihre Netzwerke (umgekehrter Befehl)

```bash
docker network inspect <network-name>
```

Beispiel:

```bash
docker network inspect bridge
```

---

### Container und Ping Befehl

1. Interaktiv in Container einsteigen:

```bash
docker exec -it <container-name> bash
```

2. Ping ausführen:

```bash
ping <ziel-container-name>
```

Beispiel:

```bash
ping db
```

---

## Aufgabe 5 – Docker-Compose Cheat-Sheet

### Allgemeine Befehle

```bash
docker-compose up           # Container starten
docker-compose up -d        # Container im Hintergrund starten
docker-compose down         # Alles stoppen und Netzwerke entfernen
docker-compose build        # Container-Images bauen
docker-compose restart      # Container neu starten
docker-compose logs         # Logs anzeigen
docker-compose logs -f      # Live-Logs
```

---

### Container-Management

```bash
docker-compose ps           # Laufende Container anzeigen
docker-compose stop         # Container stoppen
docker-compose start        # Container starten
```

---

### Services & Images

```bash
docker-compose images       # Zeigt genutzte Images
docker-compose rm           # Entfernt gestoppte Container
```

---

### Netzwerke & Volumes

```bash
docker network ls           # Netzwerke anzeigen
docker volume ls            # Volumes anzeigen
```

---

### Container mit Änderungen neu bauen

```bash
docker-compose up --build   # Erzwingt Neubau des Images
```

---

### Container testen und Befehl ausführen

```bash
docker-compose exec <service> bash        # In Container-Shell einsteigen
docker-compose exec <service> <befehl>    # Befehl ausführen
```
