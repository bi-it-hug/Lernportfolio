# 02 - Verschlüsselung

Symmetrische und asymmetrische Verschlüsselung sind zwei grundlegende Methoden der Kryptographie:

**Symmetrische Verschlüsselung:**
- **Prinzip:** Ein einzelner Schlüssel wird sowohl für die Verschlüsselung als auch für die Entschlüsselung der Daten verwendet.
- **Schlüsselaustausch:** Der Schlüssel muss sicher zwischen Sender und Empfänger ausgetauscht werden.
- **Beispiele:** AES (Advanced Encryption Standard), DES (Data Encryption Standard).
- **Vorteil:** Schneller und weniger rechenintensiv.
- **Nachteil:** Der sichere Austausch des Schlüssels kann problematisch sein.

**Asymmetrische Verschlüsselung:**
- **Prinzip:** Ein Paar aus einem öffentlichen Schlüssel (für die Verschlüsselung) und einem privaten Schlüssel (für die Entschlüsselung) wird verwendet.
- **Schlüsselaustausch:** Der öffentliche Schlüssel kann frei verteilt werden, während der private Schlüssel geheim bleibt.
- **Beispiele:** RSA, ECC (Elliptic Curve Cryptography).
- **Vorteil:** Kein sicherer Schlüsselaustausch erforderlich, da nur der öffentliche Schlüssel verbreitet wird.
- **Nachteil:** Langsamer und rechenintensiver im Vergleich zur symmetrischen Verschlüsselung.

In der Praxis werden oft beide Methoden kombiniert verwendet: asymmetrische Verschlüsselung für den Schlüsselaustausch und symmetrische Verschlüsselung für die eigentliche Datenübertragung (z.B. in TLS/SSL).

***

## 01 - Caesar

Die Caesar-Verschlüsselung, benannt nach Julius Caesar, ist eine einfache und klassische Methode der Substitutionsverschlüsselung. Hier sind die wichtigsten Punkte über die Caesar-Verschlüsselung:

1. **Prinzip**:
   - Jeder Buchstabe im Klartext wird durch einen Buchstaben ersetzt, der im Alphabet eine feste Anzahl von Positionen verschoben ist.

2. **Verschlüsselung**:
   - Die Verschiebung (Shift) wird durch eine Zahl \( k \) bestimmt, die die Anzahl der Positionen angibt, um die jeder Buchstabe im Alphabet verschoben wird.
   - Beispiel bei \( k = 3 \): A wird zu D, B wird zu E, C wird zu F usw.

3. **Entschlüsselung**:
   - Um den verschlüsselten Text (Chiffretext) wieder in Klartext zu verwandeln, wird die Verschiebung umgekehrt.
   - Beispiel bei \( k = 3 \): D wird zu A, E wird zu B, F wird zu C usw.

4. **Mathematische Darstellung**:
   - Verschlüsselung: \( E(x) = (x + k) \mod 26 \)
   - Entschlüsselung: \( D(x) = (x - k) \mod 26 \)
   - Hierbei steht \( x \) für die Position des Buchstabens im Alphabet (A = 0, B = 1, ..., Z = 25) und \( k \) für die Verschiebung.

5. **Einfachheit**:
   - Die Caesar-Verschlüsselung ist sehr einfach zu implementieren und zu verstehen.

6. **Sicherheitsaspekte**:
   - Die Caesar-Verschlüsselung gilt als unsicher, da sie leicht durch eine Häufigkeitsanalyse oder einfaches Ausprobieren aller 25 möglichen Verschiebungen (Brute-Force-Angriff) geknackt werden kann.

7. **Historische Bedeutung**:
   - Julius Caesar benutzte diese Methode, um militärische Nachrichten zu verschlüsseln.
   - Es ist eine der frühesten bekannten Formen der Verschlüsselung und legte den Grundstein für die Entwicklung komplexerer kryptographischer Verfahren.

8. **Begrenzungen**:
   - Funktioniert nur für alphabetische Texte.
   - Bei einer Verschiebung um 26 (die Länge des Alphabets) erhält man wieder den Originaltext, daher gibt es effektiv nur 25 mögliche Verschiebungen.

Die Caesar-Verschlüsselung ist ein grundlegendes Beispiel für Substitutionsverschlüsselung und wird oft als Einstieg in die Kryptographie verwendet.

***

# 10 - Git

## 01 - Einführung

Gerne! Hier sind die grundlegenden Konzepte und Befehle von Git:

### Was ist Git?
Git ist ein verteiltes Versionskontrollsystem, das hauptsächlich zur Verwaltung von Quellcode verwendet wird. Es ermöglicht mehreren Entwicklern, gleichzeitig an Projekten zu arbeiten, Änderungen nachzuverfolgen und den Projektverlauf zu verwalten.

### Grundlegende Konzepte
1. **Repository (Repo)**: Ein Verzeichnis, das alle Dateien und den kompletten Verlauf eines Projekts enthält.
2. **Commit**: Eine Momentaufnahme des Projekts. Jeder Commit hat eine eindeutige ID und speichert den aktuellen Stand des Projekts.
3. **Branch**: Ein paralleler Entwicklungszweig. Der Hauptzweig heisst normalerweise "master" oder "main".
4. **Merge**: Das Zusammenführen von Änderungen aus verschiedenen Branches.
5. **Clone**: Eine Kopie eines existierenden Repositories.
6. **Remote**: Ein entferntes Repository, normalerweise auf einem Server wie GitHub oder GitLab.

### Grundlegende Befehle
- **Initialisierung eines neuen Repositories**
  ```ps
  git init
  ```

- **Klonen eines existierenden Repositories**
  ```ps
  git clone <repository-url>
  ```

- **Überprüfen des Repository-Status**
  ```ps
  git status
  ```

- **Hinzufügen von Änderungen zur Staging-Area**
  ```ps
  git add <datei1> <datei2>
  # oder alle Dateien hinzufügen
  git add .
  ```

- **Committen der Änderungen**
  ```ps
  git commit -m "Beschreibung der Änderungen"
  ```

- **Überprüfen des Commits-Verlaufs**
  ```ps
  git log
  ```

- **Erstellen eines neuen Branches**
  ```ps
  git branch <neuer-branch-name>
  ```

- **Wechseln zu einem anderen Branch**
  ```ps
  git checkout <branch-name>
  ```

- **Zusammenführen von Branches**
  ```ps
  git merge <branch-name>
  ```

- **Hochladen von Änderungen zu einem Remote-Repository**
  ```ps
  git push <remote-name> <branch-name>
  ```

- **Herunterladen von Änderungen von einem Remote-Repository**
  ```ps
  git pull <remote-name> <branch-name>
  ```

### Weitere nützliche Befehle
- **Remote hinzufügen**
  ```ps
  git remote add <remote-name> <repository-url>
  ```

- **Änderungen anzeigen**
  ```ps
  git diff
  ```

- **Stash Änderungen (Änderungen zwischenspeichern)**
  ```ps
  git stash
  ```

- **Stash anwenden**
  ```ps
  git stash apply
  ```

Diese Befehle und Konzepte sollten dir einen guten Start mit Git ermöglichen. Es gibt viele weitere Funktionen und Details, die Git bietet, aber dies deckt die Grundlagen ab.

***

# 01 - Datenschutz

## 07 - Nutzungsbestimmungen

### Gewählte Plattform:
![YouTube Logo](yt-logo.svg)

- **Wo finde ich die Datenschutz-/Nutzungsbestimmungen (URL)?**

    - [YouTube - Nutzungsbestimmungen](https://www.youtube.com/t/terms)
    - [Google - Datenschutzerklärung](https://policies.google.com/privacy?hl=de#infocollect)

- **Welche Daten (z.B. Personendaten) werden gespeichert (Auflisten)?**

    - **Accountinformationen**:
        - Benutzername
        - E-Mail-Adresse
        - Passwort

    - **Nutzungsdaten**:
        - Gesehene Videos
        - Dauer des Video-Konsums
        - Vorlieben für bestimmte Inhalte

    - **Geräteinformationen**:
        - Gerätetyp
        - Betriebssystem
        - IP-Adresse

    - **Standortdaten**:
        - Ungefährer Standort (GPS, WLAN, Mobilfunkmasten)

    - **Cookies und ähnliche Technologien**:
        - Tracking von Interaktionen auf der Plattform

    - **Werbung und Tracking**:
        - Personalisierte Werbung basierend auf Nutzungsverhalten

- **Für was werden die Daten verwendet?
Werden die Daten weitergegeben? Wenn ja, an wen?**

    - **Bereitstellung von Diensten**:
        - Nutzen der Daten für Dienstleistungen wie Suchergebnisse und Empfehlungen von Inhalten.

    - **Wartung und Verbesserung von Diensten**:
        - Verwendung der Daten zur Fehlerbehebung und Verbesserung der Dienste basierend auf Nutzungsdaten.

    - **Entwicklung neuer Dienste**:
        - Nutzung von Erkenntnissen aus vorhandenen Diensten zur Entwicklung neuer Funktionen und Services.

    - **Personalisierung von Diensten und Werbung**:
        - Anpassung von Inhalten und Werbung basierend auf den Nutzerinteressen und -aktivitäten.

    - **Messung der Leistung**:
        - Analyse der Daten, um die Nutzung der Dienste zu verstehen und deren Leistung zu bewerten.

    - **Kommunikation mit Benutzern**:
        - Direkte Kommunikation mit Benutzern, einschliesslich Benachrichtigungen über Dienständerungen oder verdächtige Aktivitäten.

    - **Schutz von Google, Nutzern und der Öffentlichkeit**:
        - Verwendung von Daten, um Betrug, Missbrauch und Sicherheitsrisiken zu erkennen und zu bekämpfen, um die Sicherheit und Zuverlässigkeit der Dienste zu gewährleisten.

- **Darf der Dienst/Service/Plattform meine Bilder/Videos weiterverkaufen?
Wie können die Daten gelöscht werden?**

    - **Weiterverkauf von Bildern/Videos**:
        - Die Datenschutzrichtlinien der jeweiligen Dienstleistung sollten klären, ob Bilder und Videos weiterverkauft werden dürfen. In der Regel behalten sich Dienste das Recht vor, Inhalte zu verwenden, um ihre Dienste zu verbessern oder personalisierte Werbung zu schalten. Es ist ratsam, die Nutzungsbedingungen und Datenschutzrichtlinien zu überprüfen, um sicherzustellen, dass Sie die Bedingungen verstehen.

    - **Löschung von Daten**:
        - Die meisten Dienste bieten Möglichkeiten, Daten zu löschen. Normalerweise gibt es in den Einstellungen oder Kontoeinstellungen eine Option zur Datenverwaltung oder zum Löschen von Daten. Es ist jedoch wichtig zu beachten, dass das Löschen von Daten nicht immer bedeutet, dass sie vollständig aus den Servern des Dienstes entfernt werden. Einige Daten können aus Backup-Systemen möglicherweise nicht sofort gelöscht werden. Es ist ratsam, die spezifischen Anweisungen des Dienstes zur Löschung von Daten zu befolgen und sich gegebenenfalls direkt an den Dienst zu wenden, um weitere Unterstützung zu erhalten.

***

## 05 - Auskunftsrecht

### [Musterbrief Lösung](musterbrief_auskunftsrecht_eigene_daten.pdf)

#### Stickpunkte:

- Datenschutzgesetz (DSG) gewährt Auskunftsrecht über Bearbeitung von Personendaten

- Personen können Kontrolle über ihre Daten ausüben und ihre Rechte durchsetzen
- Verantwortlicher muss bei Ausübung des Auskunftsrechts bestimmte Informationen bereitstellen, einschliesslich Identität und Kontaktdaten, Details zur Datenbearbeitung und -zweck, Aufbewahrungsdauer, Datenherkunft, mögliche automatisierte Entscheidungen und Empfänger der Daten

- Auskunftsrecht kann ohne Begründung ausgeübt werden

- Auskunft wird in der Regel innerhalb von 30 Tagen kostenlos erteilt, Gebühren können bei unverhältnismässigem Aufwand anfallen

- Verweigerung, Einschränkung oder Aufschub der Auskunft muss begründet werden

- Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter bietet Musterbrief für Auskunftsbegehren an

- Auskunftsbegehren können elektronisch oder per Post gestellt werden, Verantwortlicher muss angemessene Massnahmen zum Datenschutz treffen

- Bei Nichterhalt einer Antwort innerhalb von 30 Tagen kann eingeschriebener Brief gesendet werden.

***

## 04 - Datensicherheit und Datenschutz

>[!NOTE]
Der Unterschied zwischen Datenschutz und Datensicherheit liegt in ihren Schwerpunkten und Zielen. Datensicherheit konzentriert sich auf technische und organisatorische Massnahmen, um Daten vor Bedrohungen wie Manipulation, unbefugtem Zugriff und Ausfall zu schützen. Die Hauptziele der Datensicherheit, gemäss der CIA-Triad, umfassen Verfügbarkeit, Vertraulichkeit und Integrität der Daten.

### Datensicherheit

- Verfügbarkeit: Gewährleistung, dass Daten innerhalb eines festgelegten Zeitraums verfügbar sind und Systemausfälle vermieden werden.

- Vertraulichkeit: Sicherstellung, dass Daten nur von autorisierten Benutzern gelesen oder geändert werden können, sowohl während der Speicherung als auch bei der Übertragung.

- Integrität: Sicherstellung, dass Daten nicht unbemerkt verändert werden und alle Änderungen nachvollziehbar sind.

![Datensicherheit Dreieck](triangle.bmp)

### Datenschutz

Datenschutz hingegen bezieht sich auf den Schutz personenbezogener Daten und umfasst rechtliche und ethische Aspekte. Dies kann den Schutz vor missbräuchlicher Datenverarbeitung, die Sicherung des Rechts auf informationelle Selbstbestimmung, den Schutz der Privatsphäre und anderer Persönlichkeitsrechte umfassen.


>[!IMPORTANT]
Insgesamt kann man sagen, dass Datensicherheit sich auf technische und organisatorische Massnahmen konzentriert, um Daten zu schützen, während Datenschutz sich auf rechtliche und ethische Aspekte des Schutzes personenbezogener Daten konzentriert.

***

## 03 - Herausforderungen in der digitalen Welt

### Gruppenarbeit

>[!NOTE]
In Bezug auf die Thematik selbstfahrender Autos und der Frage der Haftung bei Unfällen stehen verschiedene ethische und rechtliche Fragen im Raum.

#### 1. Haftung
- Die Frage nach der Haftung bei Unfällen mit selbstfahrenden Autos ist komplex und noch nicht abschliessend geklärt. Es könnte sein, dass die Hersteller der Fahrzeuge, die Softwareentwickler oder sogar die Fahrzeughalter in Frage kommen könnten, je nach den Umständen des Unfalls und den geltenden Gesetzen.

#### 2. Ethik:
- Im Szenario eines bevorstehenden Unfalls stellt sich die ethische Frage, ob das Auto die Insassen schützen sollte oder die Fussgänger. Diese Entscheidung könnte Leben retten, aber auch moralische Dilemmata aufwerfen.

- Die erste Möglichkeit, in einen Baum zu fahren, um den Fussgänger zu retten, könnte ethisch gerechtfertigt sein, da sie die Lebensrettung priorisiert, aber gleichzeitig die Insassen gefährdet.

- Die zweite Möglichkeit, nicht auszuweichen, könnte die Insassen schützen, aber auf Kosten des Fussgängers gehen.

#### 3. Entscheidungsfindung:
- Selbstfahrende Autos müssen möglicherweise in der Lage sein, in Echtzeit komplexe ethische Entscheidungen zu treffen. Die Programmierung dieser Entscheidungen könnte eine grosse Herausforderung darstellen und erfordert möglicherweise eine umfassende rechtliche und ethische Rahmenbedingungen.

#### 4. Gesellschaftliche Debatte:
- Diese Fragen erfordern eine breite gesellschaftliche Debatte und möglicherweise neue Gesetze oder Richtlinien, um solche Situationen angemessen zu regeln.

>[!IMPORTANT]
Insgesamt ist die Frage der Haftung und ethischen Entscheidungsfindung bei Unfällen mit selbstfahrenden Autos eine komplexe und noch nicht vollständig gelöste Problematik, die weiterhin Diskussion und Forschung erfordert.
