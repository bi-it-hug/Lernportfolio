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
