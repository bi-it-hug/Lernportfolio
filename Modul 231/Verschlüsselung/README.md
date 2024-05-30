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
