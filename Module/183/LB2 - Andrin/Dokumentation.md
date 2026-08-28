# LB2 Phase 1 – Dokumentation

**Modul 183 – Applikationssicherheit implementieren**  
**Autor:** Andrin Heinis  
**Datum:** 05.06.2026

---

## 1. Applikation starten

```bash
cd lb2-applikation/docker
docker compose -f compose.node.yaml up
```

Die App ist danach unter **[http://localhost](http://localhost)** erreichbar.

**Standard-Zugangsdaten:**


| Benutzer | Passwort       | Rolle |
| -------- | -------------- | ----- |
| admin1   | Awesome.Pass34 | Admin |
| user1    | Amazing.Pass23 | User  |


---

## 2. Gefundene und behobene SchwachstellenA

Die Schwachstellen wurden anhand der **OWASP Top 10** systematisch gesucht.

### 2.1 SQL Injection

**Datei:** `search/v2/index.js`, `savetask.js`, `edit.js`, `user/tasklist.js`  
**Problem:** Benutzereingaben wurden direkt in SQL-Queries eingebaut (String-Konkatenation). Ein Angreifer konnte beliebige SQL-Befehle einschleusen.  
**Beispiel (unsicher):**

```javascript
`SELECT * FROM tasks WHERE title LIKE '%${terms}%'`
```

**Fix:** Parameterized Statements (Prepared Statements) mit `mysql2`:

```javascript
db.executeStatement('SELECT * FROM tasks WHERE title LIKE ?', ['%' + terms + '%'])
```

---

### 2.2 Plaintext-Passwörter

**Datei:** `login.js`, DB-Schema  
**Problem:** Passwörter wurden als Klartext in der Datenbank gespeichert und beim Login direkt verglichen.  
**Fix:** Passwörter werden mit **BCrypt (Cost Factor 12)** gehasht gespeichert. Beim Login wird `bcrypt.compare()` verwendet.

---

### 2.3 Login via GET-Request (Credentials in URL)

**Problem:** Login-Formular verwendete GET-Methode — Benutzername und Passwort standen in der URL und wurden in Browser-History, Server-Logs und Proxies gespeichert.  
**Fix:** POST-Methode für Login-Formular.

---

### 2.4 Passwortfeld als `type="text"`

**Problem:** Das Passwort war beim Eintippen im Browser sichtbar.  
**Fix:** `type="password"` im Input-Feld.

---

### 2.5 Unsichere Session-Verwaltung (Cookies ohne Flags)

**Problem:** Session-Cookies hatten keine Sicherheitsflags — anfällig für XSS-basiertes Session Hijacking und CSRF.  
**Fix:** `express-session` mit `httpOnly: true` und `sameSite: 'strict'`. Zusätzlich wird die Session-ID nach dem Login regeneriert (`session.regenerate()`) zum Schutz vor Session Fixation.

---

### 2.6 Cross-Site Scripting (XSS)

**Dateien:** `index.js`, `user/tasklist.js`, `admin/users.js`, `search/v2/index.js`  
**Problem:** Benutzereingaben (Task-Titel, Username) wurden ungefiltert als HTML ausgegeben. Ein Angreifer konnte JavaScript-Code einschleusen.  
**Fix:** Alle Ausgaben werden mit `escapeHtml()` (eigene Funktion in `fw/escape.js`) kodiert.

---

### 2.7 CSRF (Cross-Site Request Forgery)

**Problem:** Formulare hatten keinen CSRF-Schutz. Ein Angreifer konnte Benutzer durch präparierte Links dazu bringen, ungewollte Aktionen auszuführen (z.B. Tasks löschen).  
**Fix:** CSRF-Token in allen POST-Formularen (`fw/csrf.js`). Jede POST-Anfrage wird serverseitig validiert.

---

### 2.8 IDOR – Insecure Direct Object Reference

**Dateien:** `edit.js`, `savetask.js`, `delete.js`  
**Problem:** Ein eingeloggter Benutzer konnte Tasks anderer Benutzer bearbeiten oder löschen, indem er die Task-ID in der URL/im Formular änderte.  
**Fix:** Jede DB-Abfrage prüft zusätzlich `WHERE userID = ?` mit der Session-User-ID. Fremde Tasks geben "Access denied" zurück.

---

### 2.9 SSRF – Server-Side Request Forgery

**Datei:** `search.js`, `user/backgroundsearch.js`  
**Problem:** Die Such-URL wurde als `provider`-Parameter vom Client mitgeschickt. Der Server machte HTTP-Anfragen an beliebige URLs — ein Angreifer konnte interne Dienste ansprechen.  
**Fix:** Die Such-URL ist serverseitig hardcodiert. Der `provider`-Parameter vom Client wurde entfernt.

---

### 2.10 Fehlende Admin-Zugriffskontrolle

**Datei:** `admin/users.js`, `app.js`  
**Problem:** Die Admin-Seite (`/admin/users`) war für jeden eingeloggten Benutzer zugänglich.  
**Fix:** Rollenprüfung in `app.js` — nur Benutzer mit `role === 'Admin'` haben Zugriff.

---

### 2.11 User-Enumeration beim Login

**Problem:** Verschiedene Fehlermeldungen ("Benutzer existiert nicht" vs. "Falsches Passwort") verrieten, ob ein Benutzername existiert.  
**Fix:** Generische Fehlermeldung: *"Invalid username or password"* in beiden Fällen.

---

### 2.12 Brute-Force-Angriff auf Login möglich

**Problem:** Keine Begrenzung von Login-Versuchen — ein Angreifer konnte unbegrenzt Passwörter ausprobieren.  
**Fix:** Nach 5 fehlgeschlagenen Versuchen (pro Username oder IP) innerhalb von 5 Minuten wird der Login gesperrt. Implementiert via `login_attempts`-Tabelle.

---

### 2.13 Passwort-Hash in HTML sichtbar

**Datei:** `admin/users.js`  
**Problem:** Das gehashte Passwort war als Hidden-Field im HTML-Quellcode der Admin-Seite sichtbar.  
**Fix:** Passwort-Spalte wird nicht mehr aus der DB abgefragt und nicht im HTML ausgegeben.

---

### 2.14 State-Injection beim Task-Speichern

**Datei:** `savetask.js`  
**Problem:** Der `state`-Wert eines Tasks wurde direkt vom Client übernommen ohne Validierung — ein Angreifer konnte beliebige Werte in die DB schreiben.  
**Fix:** Whitelist-Validierung: `const validStates = ['open', 'in progress', 'done']`.

---

### 2.15 Veraltete jQuery-Version (3.4.0)

**Datei:** `fw/header.js`  
**Problem:** jQuery 3.4.0 enthält bekannte XSS-Schwachstellen (CVE-2019-11358).  
**Fix:** Update auf jQuery **3.7.1** und jquery-validate **1.21.0**.

---

### 2.16 Security-Header fehlten

**Problem:** Ohne Security-Header können Angriffe wie Clickjacking, MIME-Sniffing oder XSS leichter ausgeführt werden.  
**Fix:** In `app.js` werden folgende Header gesetzt:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy`

---

## 3. Eigene Erweiterungen

### 3.1 User-Registrierung (`register.js`)

**Schutzziel:** Availability  
Neue Benutzer können sich selbst registrieren, ohne dass ein Admin eingreifen muss. Die Registrierung validiert:

- Mindestlänge des Passworts (8 Zeichen)
- Benutzername nur mit erlaubten Zeichen (`[a-zA-Z0-9_]`)
- Passwort-Bestätigung muss übereinstimmen
- Benutzername darf nicht bereits vergeben sein

Passwörter werden mit BCrypt (Cost 12) gehasht gespeichert.

---

### 3.2 Login-Logging & Brute-Force-Schutz (`login.js`)

**Schutzziel:** Confidentiality, Availability  
Jeder Login-Versuch wird in der Tabelle `login_attempts` protokolliert (Benutzername, IP-Adresse, Zeitstempel, Erfolg/Misserfolg).

- **Logging (Monitoring):** Verdächtige Login-Aktivitäten können im Admin-Bereich nachverfolgt werden.
- **Brute-Force-Schutz:** Nach 5 fehlgeschlagenen Versuchen innerhalb von 5 Minuten wird der Zugang temporär gesperrt.

---

### 3.3 Login-History für Benutzer (`history.js`)

**Schutzziel:** Integrity  
Jeder Benutzer kann unter `/history` seine eigenen Login-Versuche einsehen. So kann ein Benutzer erkennen, ob jemand versucht hat, sich mit seinem Account einzuloggen.

---

### 3.4 Passwort ändern (`changepassword.js`)

**Schutzziel:** Confidentiality  
Eingeloggte Benutzer können ihr Passwort ändern. Das neue Passwort muss:

- Das aktuelle Passwort korrekt sein (Verifikation mit BCrypt)
- Mindestlänge von 8 Zeichen erfüllen
- Zweimal identisch eingegeben werden

---

### 3.5 Account löschen (`deleteaccount.js`)

**Schutzziel:** Availability (Recht auf Vergessen / DSGVO)  
Benutzer können ihren Account inklusive aller zugehörigen Tasks löschen. Dies entspricht dem "Recht auf Vergessen" gemäss DSGVO.

---

## 4. Fazit

Die Applikation wurde systematisch anhand der OWASP Top 10 auf Schwachstellen analysiert. **16 Schwachstellen** wurden identifiziert und behoben. Zusätzlich wurden **5 neue Features** implementiert, die alle einen Bezug zu den CIA-Schutzzielen haben.