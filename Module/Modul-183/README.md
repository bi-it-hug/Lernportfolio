# Lernjournal

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
