# Eigene Findings (Einzelarbeit)

Stand: 2026-05-29  
Scope: `todo-list-node` (vollständiger Code-Review aller App-Dateien)

> **Remediation:** Die unten dokumentierten Schwachstellen wurden behoben. Massnahmen #1–3 und #5–10 in **Phase 1**, Verifikation in **Phase 2** (`Findings_Andrin.md`), Nachbesserung #4 (DB-Least-Privilege) in **Phase 3**. Details in [README.md](../../README.md).

## Top 10 Schwachstellen

| #   | Datei                                                           | Zeile(n)                  | Schwachstelle                   | Kurzbeschreibung                                                                                                                                                  |
| --- | --------------------------------------------------------------- | ------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `login.js`                                                      | 37                        | SQL Injection (Login)           | Query baut SQL per String-Konkatenation mit `username` → vollständiger Auth-Bypass und Datenbankzugriff möglich.                                                  |
| 2   | `login.js`                                                      | 48                        | Passwort im Klartext            | Passwortvergleich direkt gegen DB-Klartext (`password == db_password`) statt Hash (z.B. bcrypt) → bei DB-Leak alle Passwörter sofort lesbar.                      |
| 3   | `search.js`                                                     | 9–15, 15                  | SSRF + URL-Parsing-Bypass       | `provider` aus Request wird unkontrolliert als Ziel-URL verwendet; `http://localhost:3000` + `@169.254.169.254/` → Zugriff auf interne Dienste / Cloud-Metadata.  |
| 4   | `config.js`                                                     | 4                         | DB-User mit Root-Rechten        | Applikation verbindet sich als `root` – bei Kompromittierung volle DB-Rechte statt least privilege; multipliziert jeden SQLi-Fund.                                |
| 5   | `fw/header.js` / `user/tasklist.js` / `edit.js` / `savetask.js` | 23 / 17 / 16 / 10, 22, 24 | SQL Injection (mehrfach)        | `userid`, `id`, `title`, `state` werden flächendeckend in SQL per String-Konkatenation eingebaut → Datenexfiltration und -manipulation.                           |
| 6   | `edit.js` / `savetask.js`                                       | 16, 24                    | IDOR (fremde Tasks)             | Tasks werden nur per `ID` geladen/gespeichert ohne Prüfung ob `userID` übereinstimmt → jeder User kann Tasks aller anderen lesen und überschreiben.               |
| 7   | `app.js`                                                        | 51–58                     | Fehlende Admin-Rollenpruefung   | `/admin/users` ist nur durch "eingeloggt" geschützt, nicht durch Admin-Rolle → Privilege Escalation für jeden authentisierten User.                               |
| 8   | `admin/users.js`                                                | 19                        | Passwörter an Client gesendet   | Passwörter werden als `hidden`-Felder im HTML-Response an den Browser übermittelt → im Quelltext sichtbar.                                                        |
| 9   | `login.js`                                                      | 7–9, 74                   | Credentials über GET            | Benutzername und Passwort werden in der URL übertragen (`req.query`, `method="get"`) → landen in Browser-History, Server-Logs und Proxies.                        |
| 10  | `app.js` / `login.js`                                           | 19–23, 26–27              | Unsichere Session-Konfiguration | Secret hartcodiert (`secret`), keine `httpOnly`/`secure`/`sameSite`-Cookie-Flags, Login nutzt unsichere Cookies statt Server-Session → Session-Hijacking möglich. |
