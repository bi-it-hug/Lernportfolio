# M183 LB2 – TODO-App (Node.js)

Eine bewusst analysierte und teilweise abgesicherte Webanwendung für das Modul 183 (Applikationssicherheit).

## Schnellstart

### Voraussetzungen

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installiert und gestartet
- Docker Compose Version ≥ 2.20.3

### Starten

```bash
# Im Verzeichnis lb2-applikation/
docker compose -f docker/compose.node.yaml up --build
```

Die App ist danach erreichbar unter: **http://localhost**

### Stoppen

```bash
docker compose -f docker/compose.node.yaml down
```

Um auch die Datenbank-Volumes zu löschen (Reset):

```bash
docker compose -f docker/compose.node.yaml down -v
```

## Login-Daten

| Username | Passwort       | Rolle |
|----------|----------------|-------|
| admin1   | Awesome.Pass34 | Admin |
| user1    | Amazing.Pass23 | User  |

## Features

### Grundfunktionalität
- Login / Logout
- **Registrierung**: Neue Benutzer können sich selbst registrieren (Username: 3-50 Zeichen, alphanumerisch; Passwort: min. 8 Zeichen)
- TODO-Tasks erstellen, bearbeiten, löschen
- Suche nach Task-Titel
- **Login-History**: Eigene Login-Versuche (Datum, IP, Erfolg/Fehler) einsehen
- **Passwort ändern**: Self-Service-Passwortänderung mit Bestätigung des aktuellen Passworts
- **Account löschen**: Eigenen Account inkl. aller Tasks permanent löschen (DSGVO / Recht auf Vergessen)

### Sicherheits-Features (umgesetzt)
- **Brute-Force-Schutz**: Nach 5 fehlgeschlagenen Login-Versuchen innerhalb von 5 Minuten wird der Account temporär gesperrt (via `login_attempts`-Tabelle)
- **Bcrypt-Passwort-Hashing**: Passwörter werden mit bcrypt (cost 12) gehasht gespeichert
- **Session-basierte Authentifizierung**: Auth-State liegt serverseitig in der Session, nicht in manipulierbaren Cookies
- **Session-Regeneration nach Login**: Verhindert Session-Fixation-Angriffe
- **Rollenbasierte Zugriffskontrolle**: Admin-Bereich (`/admin/users`) nur für Admins zugänglich
- **Parameterized Queries**: SQL Injection durch Prepared Statements verhindert
- **HTML-Escaping**: XSS-Schutz bei allen Ausgaben
- **IDOR-Schutz**: Tasks können nur vom eigenen Benutzer gelesen/bearbeitet/gelöscht werden
- **SSRF-Schutz**: Such-Provider nicht mehr über Client-Parameter steuerbar
- **CSRF-Schutz**: CSRF-Token in allen Formularen und AJAX-Requests
- **Security Headers**: `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`
- **SameSite-Cookie**: Session-Cookie mit `SameSite=strict`
- **Input-Validierung**: Maximale Länge auf allen Eingabefeldern
- **Abhängigkeiten**: Alle bekannten CVEs in npm-Paketen behoben (`npm audit` = 0 Vulnerabilities)

## Projektstruktur

```
lb2-applikation/
├── docker/
│   ├── compose.node.yaml   # Docker Compose für Node.js
│   ├── compose.db.yaml     # Datenbank-Container
│   └── db/
│       ├── Dockerfile
│       └── m183_lb2.sql    # DB-Schema + Seed-Daten
└── todo-list-node/
    ├── app.js              # Express-Einstiegspunkt, Routen
    ├── login.js            # Login, Session, Brute-Force
    ├── index.js            # Startseite
    ├── edit.js             # Task bearbeiten/erstellen
    ├── savetask.js         # Task speichern
    ├── delete.js           # Task löschen
    ├── search.js           # Suche (POST-Handler)
    ├── admin/
    │   └── users.js        # User-Verwaltung (nur Admin)
    ├── user/
    │   ├── tasklist.js     # Task-Liste
    │   └── backgroundsearch.js  # Such-Widget
    ├── search/v2/
    │   └── index.js        # Such-Logik
    └── fw/
        ├── db.js           # Datenbank-Verbindung
        ├── escape.js       # HTML-Escape-Utility
        ├── header.js       # HTML-Header/Navigation
        └── footer.js       # HTML-Footer
```

## Troubleshooting

**Port 80 bereits belegt?**  
In `docker/compose.node.yaml` den Port ändern, z.B. `"8080:3000"`.

**Docker Compose `include`-Fehler?**  
Docker Compose auf Version ≥ 2.20.3 aktualisieren oder den Inhalt von `compose.db.yaml` direkt in `compose.node.yaml` unter `services` einfügen.

**Datenbank startet nicht?**  
```bash
docker compose -f docker/compose.node.yaml down -v
docker compose -f docker/compose.node.yaml up --build
```
