# Lernjournal

## 2026-06-26

### LB2 – Phase 3 (Nachbearbeitung)

Nach Erhalt des Testprotokolls der Tester-Gruppe (Andrin, `Findings_Andrin.md`): Bewertung der Findings, Umsetzung der verbleibenden Fixes und schriftliches Feedback.

**Feedback zum Testbericht:** Die Top-10-Findings aus dem Code-Review sind nachvollziehbar und decken die kritischsten Angriffsvektoren ab (Injection, Broken Auth, IDOR, SSRF). Die meisten Punkte waren nach Phase 1 bereits behoben; der Tester hat den Ist-Stand korrekt erfasst. Einziger verbleibender Punkt war #4 (DB-Verbindung als `root`) – dieser wurde in Phase 3 nachgezogen.

**Phase-3-Fix:** Dedizierter DB-Benutzer `m183_app` mit nur `SELECT/INSERT/UPDATE/DELETE` auf `m183_lb2.*` statt `root` (`config.js`, `.env.example`, `compose.node.yaml`, `docker/db/m183_lb2.sql`). Nach dem Update den DB-Container neu erstellen (`docker compose down -v` und neu starten), damit das Init-Skript den Benutzer anlegt.

#### Schwachstellen aus `Findings_Andrin.md` – Zuordnung nach Phase

| #   | Schwachstelle                   | Phase | Umgesetzte Massnahme                                                                                      |
| --- | ------------------------------- | ----- | --------------------------------------------------------------------------------------------------------- |
| 1   | SQL Injection (Login)           | 1     | Prepared Statement in `login.js` (`WHERE username = ?`)                                                   |
| 2   | Passwort im Klartext            | 1     | `bcrypt.compare()` in `login.js`, automatische Migration alter Klartext-Passwörter                        |
| 3   | SSRF + URL-Parsing-Bypass       | 1     | Manipulierbarer `provider` entfernt; Suche nur noch über Session-`userId` in `search/v2/index.js`         |
| 4   | DB-User mit Root-Rechten        | **3** | Neuer Benutzer `m183_app` mit Least-Privilege-Grants statt `root`                                         |
| 5   | SQL Injection (mehrfach)        | 1     | Prepared Statements in `fw/db.js`, `edit.js`, `savetask.js`, `user/tasklist.js`, `search/v2/index.js`     |
| 6   | IDOR (fremde Tasks)             | 1     | `AND userID = ?` bei SELECT/UPDATE/DELETE in `edit.js`, `savetask.js`, `deletetask.js`                    |
| 7   | Fehlende Admin-Rollenprüfung    | 1     | Middleware `requireAdmin` in `app.js`, Rollen aus DB in `fw/auth.js`                                      |
| 8   | Passwörter an Client gesendet   | 1     | `admin/users.js` zeigt nur ID, Username und Rolle – keine Passwort-Felder                                 |
| 9   | Credentials über GET            | 1     | Login-Formular auf `method="post"` umgestellt, keine `req.query`-Credentials                              |
| 10  | Unsichere Session-Konfiguration | 1     | Serverseitige Session via `express-session` mit `httpOnly`, `secure`, `sameSite`; keine Auth-Cookies mehr |

---

## 2026-06-19

### LB2 – Phase 3 (Vorbereitung)

Übergabe des Testprotokolls durch die Tester-Gruppe erhalten. Analyse der Findings in `Findings_Andrin.md` und Abgleich mit dem aktuellen Code-Stand.

---

## 2026-06-12

### LB2 – Phase 2 (Penetrationstesting)

In der Rolle als Tester: systematisches Testen der Todo-App einer anderen Gruppe. Fokus auf Autorisierung (IDOR, Admin-Schutz), Injection (SQL, XSS), Session-Manipulation und CSRF – analog zu den Kategorien aus `Findings.md`.

**Ergebnis der anderen Gruppe (Andrin):** Code-Review mit Top-10-Findings in `LB2/Projektarbeit_container/Findings_Andrin.md` dokumentiert.

---

## 2026-06-05

### LB2 – Testplan

Erstellung des `Testplan.md` für die abgesicherte Todo-App (`todo-list-node`). Der Plan umfasst:

- Funktionale Tests (Login, Task-CRUD, Suche, Admin-Bereich)
- Autorisierungstests (IDOR, Session-Manipulation)
- Sicherheits-Regressionstests (SQL Injection, XSS, CSRF, Rate-Limiting, SSRF)
- Randfälle und empfohlene Testreihenfolge

Ziel: Die in `Findings.md` dokumentierten und behobenen Schwachstellen systematisch verifizieren, bevor die App an die Tester-Gruppe übergeben wird.

---

## 2026-05-29

### LB2 – Phase 1: Sicherheitslücken schliessen

Alle im Code-Review identifizierten Schwachstellen in `todo-list-node` wurden behoben (9 von 10 Findings aus `Findings_Andrin.md`; #4 DB-Root folgte in Phase 3). Massnahmen u. a.:

- **Session-Auth** – serverseitige Session statt manipulierbarer Cookies (`fw/auth.js`, `fw/security.js`)
- **SQL Injection** – Prepared Statements statt String-Konkatenation
- **Passwörter** – bcrypt-Hashing statt Klartextvergleich
- **CSRF** – Token-Prüfung auf allen schreibenden Endpunkten
- **XSS** – Output-Encoding mit `escapeHtml()`
- **IDOR** – Eigentümerprüfung bei Tasks (`userID`)
- **Helmet** – Security-Header (CSP, `X-Content-Type-Options`, …)
- **Rate-Limiting** – Login- und Such-Endpunkte begrenzt
- **SSRF** – manipulierbarer `provider` entfernt
- **Admin** – Rollenprüfung vor `/admin/users`
- **Konfiguration** – Secrets über Umgebungsvariablen statt Hardcoding

Dokumentation aller Findings in `Findings.md`.

---

## 2026-05-22

### LB2 – Code-Review abschliessen

Abschluss des systematischen Code-Reviews der Todo-App. Über 40 Schwachstellen in `Findings.md` dokumentiert – von SQL Injection und XSS über IDOR und SSRF bis zu fehlenden Security-Headern und unsicherem Session-Handling.

---

## 2026-05-15

### LB2 – Code-Review (OWASP Top 10)

Systematische Schwachstellensuche in der Todo-App anhand der OWASP Top 10 und der Hinweise in `Findings_Stud.md`:

- Datenfluss von Formularen und Cookies nachverfolgen
- Annahme: Ein Angreifer kann alle Client-Daten manipulieren
- Bekannte Angriffe prüfen (Brute-Force, Session Hijacking, CSRF, …)

---

## 2026-05-08

### LB2 – Erste Sicherheitsfixes

Beginn der Behebung der Schwachstellen in `todo-list-node`: Umstellung auf serverseitige Session-Authentifizierung, Einführung von `fw/security.js` (CSRF, HTML-Escaping, Rollenprüfung) und sichere Session-Konfiguration in `app.js`.

---

## 2026-05-01

### LB2 – Schwachstellenanalyse

Analyse der vorgegebenen unsicheren Todo-App (`lb2-applikation-main`). Erste Findings in Login (`login.js`), Task-Verwaltung (`savetask.js`, `edit.js`) und Suche (`search.js`, `search/v2/index.js`) identifiziert.

---

## 2026-04-24

### LB2 – Methodik Pentesting

Einarbeitung in die Pentesting-Methodik laut `Auftrag_Lernende.md` und `Findings_Stud.md`:

- OWASP Top 10 als Checkliste für die Code-Analyse
- Fokus auf benutzerbeeinflussbare Eingaben (Formulare, Cookies, Hidden Fields)
- Mindestens 20+ Schwachstellen in der App erwartet

---

## 2026-04-17

### LB2 – Applikation einrichten

Start der LB2 Projektarbeit: Todo-App aus dem GitLab-Repository bezogen und mit Docker Compose gestartet (`compose.db.yaml`, `compose.node.yaml`). Die App läuft als Node.js/Express-Anwendung mit MySQL-Datenbank.

---

## 2026-04-10

### Sessionhandling

**Vor dem Login:**

array(0) {
}

**Nach dem Login:**

array(2) {
["username"]=>
string(7) "lorenzo"
["role"]=>
string(4) "user"
}

Session-ID: `41528f29670943ec2b9c194d63f1cd0f`

**Nach Eingabe eines geheimen Inhalts:**

array(3) {
["username"]=>
string(7) "lorenzo"
["role"]=>
string(4) "user"
["secret_message"]=>
string(5) "toast"
}

**Nach Logout:**

array(0) {
}

**Beobachtung:**
Nach einem erneuten Login bleibt die Session-ID unverändert. Zudem ist der Cookie auch im ausgeloggten Zustand weiterhin vorhanden. Erst beim Login als Admin wird eine neue Session-ID vergeben: `1ced6b654da14d990c9f900ea8b228f2`.

**Verbesserungsvorschlag:**
Für ein sichereres Sessionhandling sollte beim Logout die Session serverseitig invalidiert und der Session-Cookie clientseitig gelöscht werden.

Übung im Ordner `Sessionhandling/` mit PHP (`index.php`): Verhalten von `$_SESSION`, Session-ID und Cookie bei Login, Speichern und Logout beobachtet.

---

## 2026-04-03

### Sessionhandling – Vorbereitung

Vorbereitung auf die Sessionhandling-Übung: Unterschied zwischen Session-Daten (serverseitig) und Session-Cookie (clientseitig), Risiken wie Session Fixation und fehlende Invalidierung beim Logout.

---

## 2026-03-27

### LB1 – Authentication Failures (A07:2025)

Abschluss der LB1 Projektarbeit zu **OWASP A07:2025 Authentication Failures**:

- Typische Schwachstellen: Credential Stuffing, Brute-Force, hartcodierte Passwörter (CWE-259 / CWE-798), Session Fixation (CWE-384)
- Unsicheres Beispiel: Passwort direkt im Code (`demo-auth/backend/server.js`)
- Sicheres Beispiel: Secrets über Umgebungsvariablen und `.env` (dotenv)
- Live-Demo mit Express-Backend und Frontend

Dokumentation in `LB1/README.md`, Auftrag und Bewertungsraster als PDF.

Einführung in die LB2 Projektarbeit: Unterlagen (`Auftrag_Lernende.md`, `Findings_Stud.md`, Bewertungsraster) bereitgestellt.

---

## 2026-03-20

### LB1 – Vorbereitung Abschluss

Finalisierung der LB1-Dokumentation: Unterschied zwischen OWASP Top 10 Risks und OWASP Proactive Controls, Zuordnung von CWE-IDs zu konkreten Codebeispielen.

---

## 2026-03-13

### LB1 – Authentication Failures (Vertiefung)

Vertiefung zu A07:2025 Authentication Failures im Projekt `LB1/demo-auth`:

- Aufbau eines Mini-Backends mit Express.js
- Vergleich unsicherer vs. sicherer Credential-Verwaltung
- Frontend zur interaktiven Demonstration beider Varianten

---

## 2026-03-06

### OWASP Top 10 – Einstieg

Einführung in die OWASP Top 10 (2025) als systematische Grundlage für die Sicherheitsanalyse von Webanwendungen. Zuordnung der Risiken zu konkreten CWE-Einträgen und Beginn der LB1-Recherche zu Authentication Failures.

---

## 2026-02-27

**CWE** _(**C**ommon **W**eakness **E**numeration)_ ist im Grunde eine standardisierte Liste typischer Software-Schwächen – also Fehlerarten in Programmen, die Sicherheitsprobleme verursachen können.

**Was ist CWE?**
CWE ist ein gemeinsames, standardisiertes System, das Software-Schwächen beschreibt.
Jede Schwäche hat eine eindeutige ID, einen Namen und eine Beschreibung. Zusätzlich gibt es Beispiele und manchmal Hinweise, wie man diese Schwächen vermeiden kann.

**Wie hängt CWE mit OWASP zusammen?**
OWASP erstellt beispielsweise die berühmte **OWASP Top Ten**, die die zehn häufigsten Sicherheitsrisiken in Webanwendungen aufführt, wie:

- Injection
- Broken Access Control
- Security Misconfiguration

Viele dieser Risiken basieren auf spezifischen CWE-Einträgen.

**Beispiel:**
SQL Injection → basiert auf **CWE-89**
Das bedeutet: OWASP sagt damit: „Das ist ein hohes Risiko, das ihr unbedingt beachten müsst!“

**Zusammenfassung der OWASP-Richtlinien:**

- **OWASP Top Ten Risks:** Zeigt die häufigsten Sicherheitsrisiken in Webanwendungen – also, was alles schiefgehen kann.
- **OWASP Proactive Controls:** Zeigt Best Practices, um diese Risiken von vornherein zu verhindern.

Beginn LB1: erste Recherche und Dokumentation zu CWE und OWASP.

---

## 2026-02-20

### WICHTIGE SCHUTZZIELE: CIA

**C – Confidentiality (Vertraulichkeit)**

- Es geht darum, **WER** was an **DATEN** darf.
- **Wer:** Benutzer müssen sich **authentifizieren** (z. B. Login mit Passwort).
- **Welche Daten:** Berechtigungen werden meist auf Ordner-/Datei- oder Gruppenebene vergeben.
- **Was tun:** Rechte wie lesen, schreiben, ausführen; bei Apps auch kontextabhängig (z. B. nur eigene Profildaten editieren).
- **Extras:** Verschlüsselung schützt vor unautorisiertem Zugriff.

**I – Integrity (Integrität)**

- Infos sollen **nicht unbefugt verändert** werden.
- **Wer:** Authentifizierung und Autorisierung wichtig, nur Berechtigte dürfen ändern.
- **Nachvollziehbarkeit:**
    - **Logging & Monitoring:** Verfolgt wer was gemacht hat; Alarm bei unerlaubten Aktionen.
    - **Backup:** Historie erlaubt Nachvollzug von Änderungen (nicht immer wer).

**A – Availability (Verfügbarkeit)**

- Systeme und Daten müssen **immer dann verfügbar** sein, wenn sie gebraucht werden.
- **Massnahmen:**
    - Wartung ausserhalb der Bürozeiten.
    - Meldung vor destruktiven Aktionen.
    - Papierkorb-System: markierte Daten können wiederhergestellt werden.
    - Regelmässige Backups, um Datenverlust zu verhindern (z. B. bei Ransomware).

Kurz gesagt:

- **Vertraulichkeit = Wer darf was sehen/machen**
- **Integrität = Daten dürfen nicht kaputtgemacht werden / Nachvollziehbarkeit**
- **Verfügbarkeit = Daten und Systeme sind da, wenn du sie brauchst**

---

- **Authentizität (Authenticity)**: Authentizität bezeichnet die
  Echtheit, Glaubwürdigkeit und Überprüfbarkeit von Daten, Benutzern oder Systemen. Sie stellt sicher, dass eine Information tatsächlich von der angegebenen Quelle stammt und nicht gefälscht wurde. Als zentrales Schutzziel der Informationssicherheit (neben Vertraulichkeit, Integrität, Verfügbarkeit) gewährleistet sie die zweifelsfreie Identität.

- **Nichtabstreitbarkeit (Non-Repudiation)**: Nichtabstreitbarkeit ist ein Schutzziel der Informationssicherheit, das sicherstellt, dass eine Partei (Sender, Empfänger oder Akteur) getätigte Aktionen oder Nachrichten nicht nachträglich leugnen kann. Sie bietet Beweiskraft für die Herkunft, Integrität und den Empfang von Daten, oft durch digitale Signaturen.

- **Verlässlichkeit (Reliability)**: Verlässlichkeit bezeichnet die
  Fähigkeit eines Systems oder einer Komponente, über einen festgelegten Zeitraum unter definierten Bedingungen fehlerfrei zu funktionieren. Sie ist ein zentrales Qualitätsmerkmal, das hohe Verfügbarkeit, geringe Ausfallraten und die korrekte Ausführung von Funktionen garantiert.
