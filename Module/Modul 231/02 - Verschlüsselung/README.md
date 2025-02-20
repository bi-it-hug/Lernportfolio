# 02 - Verschlüsselung

## 04 - Hash knacken

1. **MD5 (ohne Salz):** `b68a03c41c766d8c13e7a92ab18f7e58` -> Klartext: `qwertz`

2. **MD5 (mit Salz):** `fcea6264406204ade8f24d41871f1eb3` -> Nicht knackbar ohne Salz

3. **SHA-256 (ohne Salz):** `0bf83ff3617d7ab2bc13223f61fbb6c2a851257553d009ee04186acee09d0f41` -> Nicht geknackt

4. **SHA-256 (mit Salz):** `d0f70aae4c886b6c7c121a2c420ed3b3b7ab7388ccc748152732bc1e55d727f7` -> Nicht knackbar ohne Salz

Für die Hashes mit Salz ist das exakte Salz notwendig, um irgendeine Chance zu haben, den Klartext zu berechnen. 

Für den SHA-256-Hash ohne Salz könnte ein gezielter Brute-Force- oder Wörterbuchangriff mit mehr Zeit und Rechenleistung eventuell erfolgreich sein, aber das ist stark vom Klartext abhängig.

***

## 03 - Hash

Ein Hash ist sozusagen wie eine feste Identifikationsnummer einer Nachricht oder Datei.

In diesem Python-Beispiel ist ein Code, der eine zufällige (aber feste) Hash-Nummer bekommen hat:

~~~py
print('Good Morning!')
~~~
> Datei geändert am 30.05.2024 <br>
Hash >> 195038

Sobald wir aber auch nur irgendetwas an der Datei ändern, ändert sich der Hash-Code:

~~~py
print('Good Morning')
~~~
> Datei geändert am 31.05.2024 <br>
Hash >> 512840

Wird die Datei aber wieder in den exakten vorherigen Stand geändert, dann wird nicht ein neuer Hash-Code generiert, sondern der alte Code wird wieder hervorgeholt:

~~~py
print('Good Morning!')
~~~
> Datei geändert am 01.06.2024 <br>
Hash >> 195038

### Wie funktioniert ein Hash?

Ein Hash ist das Ergebnis einer Hashfunktion, die eine Eingabe (z.B. eine Datei oder eine Nachricht) nimmt und sie in einen festen Wert, den sogenannten Hash-Wert oder Hash-Code, umwandelt. Dieser Wert ist normalerweise eine feste Länge und repräsentiert die Daten in einer Weise, die praktisch einzigartig ist. Änderungen an der Eingabe, auch nur geringfügige, führen zu einem völlig anderen Hash-Wert.

### Eigenschaften von Hash-Funktionen

1. **Deterministisch**: Die gleiche Eingabe führt immer zur gleichen Ausgabe.
2. **Schnell zu berechnen**: Der Hash-Wert kann schnell berechnet werden.
3. **Vorbildlich gleichmäßig**: Kleine Änderungen an der Eingabe führen zu drastischen Änderungen im Hash-Wert.
4. **Kollisionsresistent**: Es ist extrem unwahrscheinlich, dass zwei verschiedene Eingaben den gleichen Hash-Wert erzeugen.

Hash-Funktionen werden in vielen Bereichen der Informatik verwendet, darunter in der Kryptographie, bei Datenstrukturen wie Hash-Tabellen und zur Datenintegrität.

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

