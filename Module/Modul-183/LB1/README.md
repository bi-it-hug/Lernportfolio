# A07:2025 Authentication Failures

### Theoretische Hintergründe

Authentication Failures (Authentifizierungsfehler) beschreibt Schwachstellen, bei denen ein System einen ungültigen oder falschen Benutzer fälschlicherweise als legitim anerkennt. Trotz standardisierter Frameworks bleibt diese Kategorie auf Platz 7 der OWASP Top 10 von 2025, mit **36 zugeordneten CWEs**, darunter:

- **CWE-259**: Verwendung von fest kodierten Passwörtern
- **CWE-297**: Unsachgemässe Validierung von Zertifikaten bei Host-Mismatch
- **CWE-287**: Unsachgemässe Authentifizierung
- **CWE-384**: Session Fixation
- **CWE-798**: Nutzung von fest kodierten Anmeldeinformationen

---

### Typische Schwachstellen und Angriffsmöglichkeiten

Ein System ist anfällig, wenn es:

- Automatisierte Angriffe wie **Credential Stuffing** oder **Password Spray** zulässt, bei denen bekannte oder leicht zu erratende Passwörter ausprobiert werden (z. B. Password1!, Password2!).
- Brute-Force-Angriffe oder andere automatisierte, skriptgesteuerte Angriffe nicht schnell blockiert.
- Standard- oder schwache Passwörter zulässt (z. B. „admin“ / „admin“).
- Neue Benutzerkonten mit bereits bekannten geleakten Passwörtern erlaubt.
- Schwache Passwort-Wiederherstellungsmechanismen nutzt, z. B. leicht zu erratende Sicherheitsfragen.
- Passwörter im Klartext oder schwach verschlüsselt speichert (siehe A04:2025 – Cryptographic Failures).
- Multi-Faktor-Authentifizierung fehlt oder unzureichend implementiert ist.
- Schwache Fallback-Mechanismen bei fehlender Multi-Faktor-Authentifizierung erlaubt.
- Session-IDs in URLs, versteckten Feldern oder unsicheren Orten offenlegt.
- Session-IDs nach erfolgreichem Login wiederverwendet.
- Benutzersitzungen oder Authentifizierungs-Tokens (inkl. SSO) nicht korrekt invalidiert, z. B. bei Logout oder Inaktivität.
- Den Umfang und die vorgesehenen Berechtigungen der bereitgestellten Credentials nicht korrekt überprüft.

---

### Mögliche Folgen

- **Unbefugter Zugriff** auf sensible Daten oder Funktionen
- **Kontenübernahme** von legitimen Benutzern
- **Datendiebstahl** und Leakage von Passwörtern
- **Erhöhtes Risiko für weitere Angriffe**, z. B. Privilege Escalation
- **Vertrauensverlust und rechtliche Konsequenzen** für Unternehmen

## Codebeispiel Schwachstelle

Das folgende Beispiel zeigt ein **hart codiertes Passwort** im Quellcode. Wird der Code geleakt oder in einem Repository veröffentlicht, ist das Passwort sofort kompromittiert.

```javascript
// Unsicher: Passwort ist direkt im Code hinterlegt (Hardcoded Password)
const DB_HOST = "db.internal.local";
const DB_USER = "app_user";
const DB_PASSWORD = "SuperSecret123!"; // CWE-259 / CWE-798

function connectToDatabase() {
    console.log(`Verbinde mit ${DB_HOST} als ${DB_USER}`);
    // Beispielhaft: Verbindung würde mit DB_PASSWORD aufgebaut
}
```

## Codebeispiel Massnahme

Die Zugangsdaten werden **nicht im Code**, sondern über **Umgebungsvariablen** bezogen. So können Secrets getrennt vom Quellcode verwaltet werden (z. B. Secret Manager, CI/CD-Variablen, `.env` nur lokal).

```javascript
// Sicherer: Passwort wird aus Umgebungsvariablen geladen
const DB_HOST = process.env.DB_HOST || "db.internal.local";
const DB_USER = process.env.DB_USER || "app_user";
const DB_PASSWORD = process.env.DB_PASSWORD;

function connectToDatabase() {
    if (!DB_PASSWORD) {
        throw new Error("DB_PASSWORD ist nicht gesetzt.");
    }
    console.log(`Verbinde mit ${DB_HOST} als ${DB_USER}`);
    // Beispielhaft: Verbindung würde mit DB_PASSWORD aufgebaut
}
```

## Erläuterung zu CWE und Zusammenhang mit OWASP Top 10

CWE (**Common Weakness Enumeration**) ist ein standardisierter Katalog von Software-Schwachstellen. Jede Schwachstelle hat eine eindeutige ID und Beschreibung (z. B. CWE-259: Hardcoded Password). Die **OWASP Top 10** gruppieren häufige und kritische Risiken auf höherer Ebene. Ein OWASP-Risiko umfasst in der Regel mehrere konkrete CWE-Einträge.  
Beispiel: A07:2025 Authentication Failures umfasst u. a. CWE-259, CWE-287 und CWE-798.

## Unterschied: OWASP Top 10 Risk vs. OWASP Proactive Controls

- **OWASP Top 10 Risk**: Risikoorientierte Liste der häufigsten und kritischsten Schwachstellen in Webanwendungen (Was geht typischerweise schief?).
- **OWASP Proactive Controls**: Handlungsorientierte Best Practices für die Entwicklung (Was sollten Entwickler konkret tun, um Risiken zu verhindern?).

Kurz gesagt: Top 10 beschreibt primär die Problemfelder, Proactive Controls beschreibt konkrete Präventionsmassnahmen.

## Resultate, Erkenntnisse

- Das unsichere Beispiel mit hart codiertem Passwort zeigt klar das Risiko von Secret-Leakage bei Code-Veröffentlichung.
- Das sichere Beispiel mit Umgebungsvariablen trennt Secret und Quellcode und reduziert damit das Risiko bei Code-Leaks deutlich.
- Die Live-Demo mit Frontend und Node.js-Backend macht den Unterschied zwischen Schwachstelle und Gegenmassnahme nachvollziehbar.
- Für produktive Systeme sollten zusätzlich Secret-Manager, Rotationsprozesse und Zugriffsbeschränkungen eingesetzt werden.
- Authentication Failures sind nicht nur ein Login-Problem, sondern betreffen den gesamten Lebenszyklus von Credentials und Sessions.

## Hinweise auf weitere Unterlagen, Übungen, Tutorien (inkl. verwendeter Quellen)

- OWASP Top 10 (2025): https://owasp.org/Top10/
- OWASP Proactive Controls: https://owasp.org/www-project-proactive-controls/
- CWE-259 Hard-coded Password: https://cwe.mitre.org/data/definitions/259.html
- CWE-287 Improper Authentication: https://cwe.mitre.org/data/definitions/287.html
- CWE-798 Use of Hard-coded Credentials: https://cwe.mitre.org/data/definitions/798.html
- Demo-Code und Setup: `demo-auth/README.md`, `demo-auth/backend/server.js`, `frontend/index.html`
