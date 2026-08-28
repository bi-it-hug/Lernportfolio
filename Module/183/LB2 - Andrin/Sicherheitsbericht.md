# Sicherheitsbericht

**Projekt:** LB2 Phase 2 – Todo-List Node.js Applikation  
**Analysedatum:** 18.06.2026  
**Umfang:** Quellcode (`lb2-applikation/todo-list-node`), Docker-Konfiguration, Datenbank-Schema, Abhängigkeiten

---

## Zusammenfassung

Die Applikation ist ein LB2-Lernprojekt zur Applikationssicherheit. Viele OWASP-typische Schwachstellen wurden bereits behoben (SQL Injection, XSS, CSRF auf POST, IDOR, Brute-Force-Schutz, Passwort-Hashing). Trotzdem wurden **weitere Sicherheitsprobleme** identifiziert, die teils bewusst offen gelassen oder bei der Härtung übersehen wurden.

| Schweregrad | Anzahl |
| ----------- | ------ |
| Kritisch    | 2      |
| Hoch        | 5      |
| Mittel      | 8      |
| Niedrig     | 7      |

Die kritischsten verbleibenden Risiken sind **hardcodierte Geheimnisse im Repository**, **öffentlich dokumentierte Standard-Zugangsdaten** und **CSRF über GET `/delete`**. Die meisten anderen Befunde betreffen Fehlkonfigurationen (TLS, Session-Cookies, CSP) und fehlende Defense-in-Depth-Massnahmen (Rate Limiting, Connection Pooling).

---

## Kritische Schwachstellen

### Hardcodierte Geheimnisse im Quellcode und in Docker-Konfiguration

- **Risiko:** Kritisch
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/config.js`, `lb2-applikation/todo-list-node/app.js`, `lb2-applikation/docker/compose.db.yaml`
- **Beschreibung:** Datenbank-Passwort (`Some.Real.Secr3t`), DB-Benutzer (`root`) und ein Fallback-Session-Secret (`M183_lb2_s3ssion_s3cr3t_2024!`) sind direkt im Quellcode bzw. in Compose-Dateien hinterlegt. Obwohl `.env` in `.gitignore` steht, wird keine Umgebungsvariable für die DB-Credentials gesetzt.
- **Möglicher Angriffsvektor:** Jeder mit Zugriff auf das Repository (oder einen geleakten Commit) kann sich direkt mit der Datenbank verbinden oder Session-Cookies fälschen, sofern `SESSION_SECRET` nicht überschrieben wird.
- **Beispiel:**

```javascript
// config.js
password: "Some.Real.Secr3t";

// app.js
secret: process.env.SESSION_SECRET || "M183_lb2_s3ssion_s3cr3t_2024!";
```

- **Empfehlung zur Behebung:** Alle Secrets in Umgebungsvariablen oder einen Secret Manager auslagern (z. B. Docker Secrets, `.env` nur lokal). Fallback-Secret entfernen — die App soll ohne gesetztes `SESSION_SECRET` nicht starten. DB-Zugriff mit einem dedizierten, eingeschränkten Benutzer statt `root`.

---

### Öffentlich dokumentierte Standard-Admin-Zugangsdaten

- **Risiko:** Kritisch
- **Betroffene Datei(en):** `Dokumentation.md`, `lb2-applikation/docker/db/m183_lb2.sql`, `lb2-applikation/todo-list-node/test-security.mjs`
- **Beschreibung:** Die Dokumentation listet Standard-Zugangsdaten (`admin1` / `Awesome.Pass34`, `user1` / `Amazing.Pass23`) explizit auf. Diese Accounts werden beim DB-Init automatisch angelegt. In einer produktiven oder öffentlich erreichbaren Umgebung ist damit sofort privilegierter Zugriff möglich.
- **Möglicher Angriffsvektor:** Angreifer loggt sich mit bekannten Credentials als Admin ein und erhält vollen Zugriff auf die Benutzerverwaltung (`/admin/users`).
- **Beispiel:** `GET /login` → POST mit `username=admin1&password=Awesome.Pass34` → Zugriff auf `/admin/users`
- **Empfehlung zur Behebung:** Standard-Passwörter bei Erststart erzwingen ändern zu lassen, Seed-Accounts nur in Entwicklungsumgebungen anlegen, oder initiale Passwörter per sicherem Kanal verteilen. Dokumentation sollte keine produktiven Credentials enthalten.

---

## Hohe Schwachstellen

### CSRF über GET `/delete` (State-Changing GET)

- **Risiko:** Hoch
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/app.js` (Zeilen 66–70), `lb2-applikation/todo-list-node/delete.js`, `lb2-applikation/todo-list-node/user/tasklist.js`
- **Beschreibung:** Das Löschen von Tasks erfolgt per `GET /delete?id=...` ohne CSRF-Token. Das CSRF-Middleware (`fw/csrf.js`) prüft nur POST-Anfragen. Ein eingeloggter Benutzer kann durch eine präparierte Seite unwissentlich Tasks löschen lassen.
- **Möglicher Angriffsvektor:** Angreifer platziert auf einer externen Seite: `<img src="http://localhost/delete?id=5">`. Der Browser des Opfers sendet automatisch das Session-Cookie mit.
- **Beispiel:** Opfer ist auf `evil.com`; verstecktes Bild löscht Task ID 5 des eingeloggten Benutzers.
- **Empfehlung zur Behebung:** Löschen auf `POST /delete` mit CSRF-Token umstellen (wie bei `/savetask`). Alternativ `DELETE`-Methode mit CSRF-Header. Keine zustandsändernden Operationen per GET.

---

### Schwache Content-Security-Policy (`unsafe-inline`)

- **Risiko:** Hoch
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/app.js` (Zeilen 37–38), `lb2-applikation/todo-list-node/edit.js` (Zeilen 58–66)
- **Beschreibung:** Die CSP erlaubt `'unsafe-inline'` für Scripts. Dadurch werden Inline-`<script>`-Blöcke (z. B. in `edit.js`) ausgeführt. Bei einer zukünftigen XSS-Lücke bietet die CSP keinen wirksamen Schutz.
- **Möglicher Angriffsvektor:** Kombination aus einer Reflected/Stored-XSS-Lücke und der permissiven CSP ermöglicht vollständige Script-Ausführung im Browser-Kontext.
- **Beispiel:** CSP-Header: `script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com`
- **Empfehlung zur Behebung:** Inline-Scripts in externe `.js`-Dateien auslagern. CSP auf Nonce- oder Hash-basierte Scripts umstellen (`script-src 'self' 'nonce-...'`). `unsafe-inline` entfernen.

---

### Datenbankverbindungen werden nicht geschlossen (Connection Leak)

- **Risiko:** Hoch
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/fw/db.js`
- **Beschreibung:** Jeder Aufruf von `executeStatement()` öffnet eine neue MySQL-Verbindung via `createConnection()`, schliesst sie aber nie (`conn.end()` fehlt). Es wird kein Connection Pool verwendet.
- **Möglicher Angriffsvektor:** Unter Last (z. B. viele parallele Suchanfragen oder Brute-Force-Versuche) erschöpfen sich die DB-Verbindungen → Denial of Service.
- **Beispiel:** 100 gleichzeitige Benutzer → 100+ offene Verbindungen pro Request-Kette.
- **Empfehlung zur Behebung:** `mysql2.createPool()` mit begrenzter Pool-Grösse verwenden oder `try/finally` mit `conn.end()`. Alternativ einen ORM/Query-Builder mit eingebautem Pooling nutzen.

---

### Session-Cookie ohne `Secure`-Flag bei HTTP-Betrieb

- **Risiko:** Hoch
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/app.js` (Zeilen 23–28), `lb2-applikation/docker/compose.node.yaml`
- **Beschreibung:** Session-Cookies haben `httpOnly` und `sameSite: 'strict'`, aber kein `secure: true`. Die App läuft über HTTP (Port 80). Sessions können im Klartext über das Netzwerk übertragen werden.
- **Möglicher Angriffsvektor:** Man-in-the-Middle auf einem ungesicherten Netzwerk (öffentliches WLAN) fängt Session-Cookie ab → Session Hijacking.
- **Beispiel:** Angreifer im selben Netzwerk sniffed `connect.sid`-Cookie und übernimmt die Session.
- **Empfehlung zur Behebung:** TLS terminieren (Reverse Proxy mit HTTPS, z. B. nginx/Caddy). `cookie: { secure: true }` setzen wenn HTTPS aktiv. `Strict-Transport-Security`-Header ergänzen.

---

### Datenbankzugriff mit Root-Benutzer

- **Risiko:** Hoch
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/config.js`, `lb2-applikation/docker/compose.db.yaml`
- **Beschreibung:** Die Applikation verbindet sich als MySQL/MariaDB-`root` mit vollen Rechten. Bei einer SQL-Injection (aktuell nicht vorhanden, aber Defense-in-Depth) oder einem Kompromitt des App-Servers wäre der gesamte DB-Server betroffen.
- **Möglicher Angriffsvektor:** Kompromittierte App → `DROP DATABASE`, Zugriff auf andere Schemas, Dateizugriff via `LOAD DATA`.
- **Beispiel:** `user: 'root'` in `config.js`
- **Empfehlung zur Behebung:** Dedizierten DB-Benutzer mit minimalen Rechten (`SELECT`, `INSERT`, `UPDATE`, `DELETE` nur auf `m183_lb2`) anlegen.

---

## Mittlere Schwachstellen

### User-Enumeration bei Registrierung

- **Risiko:** Mittel
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/register.js` (Zeile 29)
- **Beschreibung:** Bei bereits vergebenem Benutzernamen erscheint die Meldung _"Dieser Benutzername ist bereits vergeben."_ — im Gegensatz zum Login, wo generische Fehlermeldungen verwendet werden.
- **Möglicher Angriffsvektor:** Angreifer enumeriert gültige Benutzernamen (`admin1`, `user1`, …) für gezielte Angriffe (Brute-Force, Phishing).
- **Beispiel:** POST `/register` mit `username=admin1` → spezifische Fehlermeldung bestätigt Existenz.
- **Empfehlung zur Behebung:** Generische Meldung wie beim Login: _"Registrierung fehlgeschlagen."_ oder absichtliche Verzögerung bei allen Registrierungsversuchen.

---

### DOM-basierter XSS-Sink in AJAX-Suche

- **Risiko:** Mittel
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/user/backgroundsearch.js` (Zeile 30), `lb2-applikation/todo-list-node/search/v2/index.js`
- **Beschreibung:** Suchergebnisse werden per `$("#result").html(data)` in den DOM eingefügt. Aktuell escaped der Server die Ausgabe korrekt (`escapeHtml`). Der Sink bleibt aber ein latentes Risiko bei zukünftigen Codeänderungen.
- **Möglicher Angriffsvektor:** Wenn jemand die Server-seitige Escaping-Logik entfernt oder umgeht, wird sofort DOM-XSS auslösbar.
- **Beispiel:** `$("#result").html("<script>alert(1)</script>")` — funktioniert nur wenn Server nicht escaped.
- **Empfehlung zur Behebung:** `.text()` statt `.html()` verwenden, oder Client-seitig mit `textContent` arbeiten. Content-Type und strukturierte JSON-Antworten statt HTML-Fragmente.

---

### Fehlendes Rate Limiting (ausser Login)

- **Risiko:** Mittel
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/app.js`, `lb2-applikation/todo-list-node/register.js`
- **Beschreibung:** Nur der Login hat Brute-Force-Schutz (5 Versuche / 5 Min.). Registrierung, Suche, Task-CRUD und andere Endpunkte sind unbegrenzt aufrufbar.
- **Möglicher Angriffsvektor:** Massen-Registrierung (Account Spam), Ressourcen-Erschöpfung durch wiederholte DB-Queries, DoS über Connection Leak.
- **Beispiel:** Script erstellt 10'000 Accounts via POST `/register`.
- **Empfehlung zur Behebung:** `express-rate-limit` global und pro Endpunkt einsetzen. CAPTCHA bei Registrierung optional.

---

### Session-Speicher im MemoryStore ohne Timeout

- **Risiko:** Mittel
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/app.js`
- **Beschreibung:** `express-session` nutzt den Default-MemoryStore. Sessions haben kein `maxAge`/Idle-Timeout. Sessions überleben Server-Neustarts nicht und skalieren nicht über mehrere Instanzen.
- **Möglicher Angriffsvektor:** Gestohlene Session-Cookies bleiben unbegrenzt gültig (bis Logout). Bei Server-Neustart werden alle Sessions invalidiert (Availability-Problem, kein Security-Plus).
- **Beispiel:** Benutzer loggt sich ein, verlässt den Arbeitsplatz — Session bleibt aktiv.
- **Empfehlung zur Behebung:** Redis- oder DB-basierter Session Store. `cookie: { maxAge: 3600000 }` (1h) und serverseitige Idle-Timeout-Logik.

---

### Ungepinnte Docker-Images (`latest`-Tags)

- **Risiko:** Mittel
- **Betroffene Datei(en):** `lb2-applikation/docker/compose.node.yaml`, `lb2-applikation/docker/db/Dockerfile`
- **Beschreibung:** `node:latest` und `mariadb:latest` werden ohne Versions-Pinning verwendet. Builds sind nicht reproduzierbar; ein Image-Update kann unerwartete Schwachstellen oder Breaking Changes einführen.
- **Möglicher Angriffsvektor:** Supply-Chain-Risiko durch kompromittiertes oder verwundbares Base-Image.
- **Beispiel:** `image: node:latest` → beim nächsten `docker compose pull` potenziell andere Node-Version.
- **Empfehlung zur Behebung:** Spezifische Versionen pinnen (z. B. `node:22-alpine`, `mariadb:11.4`). Regelmässig und kontrolliert updaten.

---

### Veraltete transitive Abhängigkeit (`form-data`)

- **Risiko:** Mittel
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/package.json`, `node_modules/form-data` (transitiv via `axios`)
- **Beschreibung:** `npm audit` meldet eine **High**-Severity-Schwachstelle in `form-data` 4.0.0–4.0.5 (CRLF Injection, GHSA-hmw2-7cc7-3qxx). `axios` ist in der App **nicht verwendet**, bringt aber die Abhängigkeit mit.
- **Möglicher Angriffsvektor:** In der aktuellen App gering (axios wird nicht importiert), aber erhöht die Angriffsfläche in `node_modules`.
- **Beispiel:** `npm audit` → 1 high severity vulnerability in form-data.
- **Empfehlung zur Behebung:** Ungenutzte Abhängigkeit `axios` entfernen. `npm audit fix` ausführen. Regelmässige Dependency-Updates.

---

### Fehlende Security-Header (HSTS, Referrer-Policy)

- **Risiko:** Mittel
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/app.js`
- **Beschreibung:** Es werden `X-Content-Type-Options`, `X-Frame-Options` und CSP gesetzt. Es fehlen `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy` und `X-XSS-Protection` (veraltet, aber teils noch erwartet).
- **Möglicher Angriffsvektor:** Ohne HSTS kann ein Angreifer HTTPS-Downgrade erzwingen. Ohne Referrer-Policy können URLs mit sensitiven Parametern an Dritte geleakt werden.
- **Beispiel:** Fehlender `Referrer-Policy`-Header → Browser sendet volle URL als Referrer.
- **Empfehlung zur Behebung:** `helmet`-Middleware verwenden oder Header manuell ergänzen. HSTS nur bei aktivem HTTPS.

---

### Offene Selbstregistrierung ohne Moderation

- **Risiko:** Mittel
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/register.js`, `lb2-applikation/todo-list-node/app.js`
- **Beschreibung:** Jeder Besucher kann unbegrenzt Accounts mit Rolle `User` erstellen. Keine E-Mail-Verifikation, kein Admin-Approval.
- **Möglicher Angriffsvektor:** Massenhafte Account-Erstellung, Ressourcenverbrauch, Missbrauch der Applikation als Hosting-Plattform.
- **Beispiel:** Bot registriert 500 Accounts in kurzer Zeit.
- **Empfehlung zur Behebung:** Registrierung deaktivierbar machen, E-Mail-Bestätigung, Rate Limiting, optional Admin-Freigabe.

---

## Niedrige Schwachstellen

### GET `/logout` ohne CSRF-Schutz

- **Risiko:** Niedrig
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/app.js` (Zeilen 122–126)
- **Beschreibung:** Logout erfolgt per GET-Link. Ein Angreifer kann einen Benutzer ausloggen lassen (Logout CSRF), was geringere Auswirkungen hat als Datenmanipulation.
- **Möglicher Angriffsvektor:** `<img src="/logout">` auf externer Seite → Opfer wird ausgeloggt.
- **Beispiel:** Benutzer muss sich erneut einloggen — Verfügbarkeits-/UX-Problem.
- **Empfehlung zur Behebung:** Logout per POST mit CSRF-Token.

---

### IP-basierter Login-Lockout kann Unschuldige sperren

- **Risiko:** Niedrig
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/login.js` (Zeilen 77–82)
- **Beschreibung:** Lockout gilt für Username **oder** IP-Adresse. Benutzer hinter gemeinsamer NAT-IP (Büro, Schule) können durch einen Angreifer mitgesperrt werden.
- **Möglicher Angriffsvektor:** Angreifer provoziert 5 Fehlversuche mit zufälligem Username → alle Nutzer der gleichen IP sind 5 Minuten gesperrt.
- **Beispiel:** `WHERE (identifier = ? OR ip_address = ?)` in `isLockedOut()`.
- **Empfehlung zur Behebung:** Lockout primär pro Account; IP-Lockout nur als sekundäre Massnahme mit höherem Schwellenwert. `app.set('trust proxy', 1)` hinter Reverse Proxy setzen.

---

### Ungenutzte npm-Abhängigkeiten

- **Risiko:** Niedrig
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/package.json`
- **Beschreibung:** `axios` und `cookie-parser` sind deklariert, werden aber nirgends importiert. Erhöhen unnötig die Dependency-Fläche.
- **Möglicher Angriffsvektor:** Schwachstellen in ungenutzten Paketen bleiben unbemerkt im `node_modules`-Baum.
- **Beispiel:** `axios` bringt `form-data` mit bekannter Schwachstelle.
- **Empfehlung zur Behebung:** `npm uninstall axios cookie-parser`.

---

### `DBSERVER`-Umgebungsvariable wird ignoriert

- **Risiko:** Niedrig
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/config.js`, `lb2-applikation/docker/compose.node.yaml`
- **Beschreibung:** Docker setzt `DBSERVER=m183-lb2-db`, aber `config.js` hardcodiert `host: 'm183-lb2-db'`. Konfiguration ist nicht flexibel und täuscht Externalisierung vor.
- **Möglicher Angriffsvektor:** Fehlkonfiguration bei Deployment in andere Umgebungen; kein direkter Exploit.
- **Beispiel:** `host: process.env.DBSERVER || 'localhost'` fehlt.
- **Empfehlung zur Behebung:** Alle Konfigurationswerte aus Umgebungsvariablen lesen.

---

### Keine Längenbegrenzung bei Suchbegriffen

- **Risiko:** Niedrig
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/search/v2/index.js`
- **Beschreibung:** Suchbegriffe (`terms`) werden nur auf Existenz geprüft, nicht auf maximale Länge. Sehr lange Strings können DB-Queries verlangsamen.
- **Möglicher Angriffsvektor:** DoS durch extrem lange Suchstrings in Kombination mit Connection Leak.
- **Beispiel:** `?terms=` + 100'000 Zeichen → langsames `LIKE`-Query.
- **Empfehlung zur Behebung:** `terms.slice(0, 255)` oder ähnliche Begrenzung serverseitig.

---

### CDN-Abhängigkeit für jQuery (Supply Chain)

- **Risiko:** Niedrig
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/fw/header.js` (Zeilen 15–16)
- **Beschreibung:** jQuery 3.7.1 und jquery-validate 1.21.0 werden von `cdnjs.cloudflare.com` geladen. CSP erlaubt dies explizit. Bei Kompromittierung des CDN könnte bösartiger Code injiziert werden.
- **Möglicher Angriffsvektor:** Supply-Chain-Angriff auf CDN → Script-Ausführung im Kontext der App.
- **Beispiel:** `<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js">`
- **Empfehlung zur Behebung:** Libraries lokal in `/public` hosten und Subresource Integrity (SRI) verwenden.

---

### Fehlende `trust proxy`-Konfiguration

- **Risiko:** Niedrig
- **Betroffene Datei(en):** `lb2-applikation/todo-list-node/app.js`, `lb2-applikation/todo-list-node/login.js`
- **Beschreibung:** `req.ip` wird für Login-Logging und Lockout verwendet, aber `app.set('trust proxy', ...)` fehlt. Hinter einem Reverse Proxy wäre die IP-Adresse falsch.
- **Möglicher Angriffsvektor:** Falsche IP in Login-History; Lockout umgehbar durch IP-Spoofing wenn Proxy-Header blind vertraut werden.
- **Beispiel:** Alle Login-Versuche zeigen Proxy-IP statt Client-IP.
- **Empfehlung zur Behebung:** `trust proxy` korrekt setzen wenn hinter Load Balancer/Proxy deployed.

---

## Positive Sicherheitsaspekte

Die folgenden Sicherheitsmechanismen sind korrekt implementiert und entsprechen bewährten Praktiken:

| Bereich                      | Implementierung                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| **SQL Injection**            | Alle DB-Queries nutzen Prepared Statements mit `?`-Platzhaltern (`fw/db.js`, alle Route-Handler) |
| **Passwort-Speicherung**     | BCrypt mit Cost Factor 12 (`login.js`, `register.js`, `changepassword.js`)                       |
| **Login-Methode**            | POST statt GET — Credentials nicht in URL                                                        |
| **Passwortfeld**             | `type="password"` im Login-Formular                                                              |
| **Session-Fixation**         | `session.regenerate()` nach erfolgreichem Login                                                  |
| **Session-Cookie-Flags**     | `httpOnly: true`, `sameSite: 'strict'`                                                           |
| **XSS-Schutz**               | Konsequente `escapeHtml()`-Funktion für alle Benutzer-/DB-Ausgaben                               |
| **CSRF (POST)**              | Token-basiertes CSRF-Middleware für alle POST-Routen                                             |
| **IDOR-Schutz**              | Task-Operationen prüfen `userID` gegen Session (`edit.js`, `savetask.js`, `delete.js`)           |
| **Admin-Autorisierung**      | Rollenprüfung `role === 'Admin'` für `/admin/users`                                              |
| **User-Enumeration (Login)** | Generische Fehlermeldung _"Invalid username or password"_                                        |
| **Brute-Force-Schutz**       | 5 Fehlversuche / 5 Min. pro Username oder IP                                                     |
| **State-Validierung**        | Whitelist für Task-Status (`open`, `in progress`, `done`)                                        |
| **SSRF**                     | Kein clientseitiger URL-Parameter mehr; Suche nur in eigener DB                                  |
| **Passwort-Hashes**          | Nicht mehr im Admin-HTML sichtbar                                                                |
| **Security-Header**          | `X-Content-Type-Options`, `X-Frame-Options`, CSP vorhanden                                       |
| **Input-Validierung**        | Username-Regex, Passwort-Mindestlänge, Passwort-Bestätigung bei Registrierung                    |
| **Container-Sicherheit**     | Web-Container läuft als Nicht-Root-User (`user: "node"`)                                         |
| **DB-Netzwerk**              | MariaDB nur intern exponiert (`expose: 3306`), nicht auf Host-Port                               |
| **Kein Datei-Upload**        | Keine Upload-Endpunkte — kein Upload-Angriffsvektor                                              |
| **jQuery-Version**           | Aktualisiert auf 3.7.1 (CVE-2019-11358 behoben)                                                  |
| **Security-Tests**           | Automatisiertes Testskript `test-security.mjs` verifiziert dokumentierte Fixes                   |

---

## Priorisierte Massnahmen

1. **GET `/delete` auf POST mit CSRF umstellen** — behebt die offene CSRF-Schwachstelle für zustandsändernde Operationen.
2. **Alle Secrets aus dem Quellcode entfernen** — Umgebungsvariablen für DB-Credentials und Session-Secret; kein Fallback-Secret.
3. **Standard-Admin-Passwörter ändern oder Erststart-Zwang einführen** — bekannte Credentials aus Dokumentation und Seed-Daten eliminieren.
4. **DB Connection Pool implementieren** — `createPool()` statt `createConnection()`; Verbindungen korrekt freigeben.
5. **TLS/HTTPS aktivieren** — Reverse Proxy mit Zertifikat; `secure: true` für Session-Cookies; HSTS-Header.
6. **CSP härten** — `unsafe-inline` entfernen; Inline-Scripts externalisieren; Nonce-basierte CSP.
7. **Dedizierten DB-Benutzer mit minimalen Rechten anlegen** — nicht `root` verwenden.
8. **Rate Limiting global einführen** — `express-rate-limit` für Registrierung, Suche und allgemeine Requests.
9. **Ungenutzte Abhängigkeiten entfernen** — `axios`, `cookie-parser` deinstallieren; `npm audit fix`.
10. **User-Enumeration bei Registrierung beheben** — generische Fehlermeldungen wie beim Login.
11. **Docker-Images pinnen** — spezifische Versionen statt `latest`.
12. **Session-Store und Timeout** — Redis/DB-Store; `maxAge` und Idle-Timeout konfigurieren.
13. **`.html()` durch `.text()` ersetzen** in AJAX-Suche — Defense-in-Depth gegen DOM-XSS.
14. **`helmet`-Middleware** — ergänzende Security-Header (HSTS, Referrer-Policy, Permissions-Policy).
15. **Logout per POST** — CSRF-geschützter Logout als kleine Verbesserung.

---

_Hinweis: Dieser Bericht bewertet den aktuellen Code-Stand. Die Datei `Dokumentation.md` beschreibt 16 bereits behobene Schwachstellen; dieser Bericht fokussiert auf verbleibende und neue Befunde sowie Konfigurationsrisiken._
