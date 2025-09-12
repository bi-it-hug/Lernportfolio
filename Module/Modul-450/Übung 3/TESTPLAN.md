## Black-Box-Testfälle (Benutzersicht)

- Hinweis: Die folgenden Testfälle beziehen sich auf die sichtbaren Funktionen im Konsolenmenü des `Counter` (Konto wählen/anzeigen/erstellen, Einzahlen, Abheben, Überweisen, Löschen, Wechselkurs abfragen, Beenden). Eingaben erfolgen als Tastatur-Strings.

| ID    | Bereich                           | Vorbedingungen              | Eingabe                                 | Erwartetes Ergebnis                                                                                       |
| ----- | --------------------------------- | --------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| BB-01 | Startinfo                         | App frisch gestartet        | –                                       | Es werden 5 vorerstellte Konten angezeigt (IDs 1–5), Ausgabe der Infozeile mit Anzahl Konten.             |
| BB-02 | Konto wählen                      | Mind. 1 Konto vorhanden     | Gültige Kontonummer (z. B. `1`)         | Kontodetails werden angezeigt; Wechsel in Konto-Aktionsmenü.                                              |
| BB-03 | Konto wählen                      | Keine spezielle             | Ungültige Eingabe (`xyz`)               | Fehlermeldung „Ungültige Eingabe …“; Menü bleibt.                                                         |
| BB-04 | Konto wählen                      | –                           | Nicht existierende Kontonummer (`999`)  | Fehlermeldung „Ein Konto mit dieser Nummer ist nicht vorhanden!“.                                         |
| BB-05 | Kontoübersicht                    | Mind. 1 Konto vorhanden     | `a`                                     | Liste aller Konten mit ID, Nachname, Währung.                                                             |
| BB-06 | Konto erstellen                   | –                           | `e`, danach Name `Meier`, Währung `CHF` | Neues Konto wird erstellt, Kontodetails werden ausgegeben.                                                |
| BB-07 | Konto erstellen                   | –                           | `e`, Währung ungültig `ABC`             | Hinweis „… nicht bekannt, es wird USD verwendet.“; Konto wird mit USD erstellt.                           |
| BB-08 | Beenden                           | –                           | `q`                                     | Ausgabe „Auf Wiedersehen!“, Programm beendet sich.                                                        |
| BB-09 | Einzahlen                         | Konto gewählt               | `e`, Betrag `100`                       | Kontostand steigt um 100, Ausgabe „Aktueller/Neuer Kontostand …“.                                         |
| BB-10 | Einzahlen (ungültig)              | Konto gewählt               | `e`, Betrag `abc`                       | Fehlermeldung „Ungültige Eingabe …“; erneute Eingabeaufforderung.                                         |
| BB-11 | Abheben (erfolgreich)             | Konto hat mind. 50          | `a`, Betrag `50`                        | Kontostand sinkt um 50; Erfolgsmeldung über Kontostand.                                                   |
| BB-12 | Abheben (zu wenig Guthaben)       | Kontostand < 1_000          | `a`, Betrag größer als Kontostand       | Fehlermeldung „Kontostand zu niedrig …“; Kontostand unverändert.                                          |
| BB-13 | Abheben (ungültig)                | –                           | `a`, Betrag `-10` oder `abc`            | Fehlermeldung; Kontostand unverändert.                                                                    |
| BB-14 | Kontostand abfragen               | Konto gewählt               | `k`                                     | Kontostand wird mit zwei Dezimalen und Währung ausgegeben.                                                |
| BB-15 | Überweisen gleiches Konto         | Mind. 2 Konten              | `ü`, Zielkontonummer = Quellkonto       | Fehlermeldung „Bitte ein anderes Konto …“.                                                                |
| BB-16 | Überweisen Ziel existiert nicht   | –                           | `ü`, Ziel `999`                         | Fehlermeldung „… nicht vorhanden!“.                                                                       |
| BB-17 | Überweisen gleicher Währung       | Zwei Konten gleiche Währung | `ü`, Betrag `50`                        | Betrag wird abgebucht und exakt gutgeschrieben; Quellkontostand sinkt, Ziel steigt.                       |
| BB-18 | Überweisen mit Währungswechsel    | Quell: USD, Ziel: CHF       | `ü`, Betrag `100`                       | Umrechnung gemäss fixen Raten im Code; Ziel erhält konvertierten Betrag; Quell wird mit 100 USD belastet. |
| BB-19 | Überweisen (zu wenig Guthaben)    | Quellkontostand < Betrag    | `ü`, Betrag höher als Saldo             | Fehlermeldung „Kontostand zu niedrig …“; beide Konten unverändert.                                        |
| BB-20 | Konto löschen (Bestätigung Ja)    | Konto gewählt               | `l`, Bestätigung `j`                    | Ausgabe „Konto … wurde gelöscht.“, Konto aus Liste entfernt.                                              |
| BB-21 | Konto löschen (Abbruch)           | Konto gewählt               | `l`, Bestätigung `n`                    | Ausgabe „Aktion abgebrochen.“, Konto bleibt bestehen.                                                     |
| BB-22 | Wechselkursabfrage (erfolgreich)  | Internet/Key erreichbar     | `w`, Eingabe `CHF USD`                  | Ausgabe „1 CHF = <kurs> USD“.                                                                             |
| BB-23 | Wechselkursabfrage (Formatfehler) | –                           | `w`, Eingabe `chfusd`                   | Fehlermeldung „Ungültige Eingabe …“; neue Eingabeaufforderung.                                            |
| BB-24 | Wechselkursabfrage (API-Fehler)   | Netzproblem/Key ungültig    | `w`, z. B. `USD EUR`                    | Ausgabe „Error bei der Abfrage …“; kein Absturz, Rückgabe 0.0.                                            |
| BB-25 | Grenzwerte Betrag                 | Konto gewählt               | Ein-/Auszahlung `0`                     | Saldo unverändert, sinnvolle Ausgabe; keine Ausnahme.                                                     |
| BB-26 | Grosse Beträge                    | –                           | Ein-/Auszahlung `1_000_000_000`         | Korrekte Berechnung ohne Überlauf; Anzeige mit zwei Dezimalen.                                            |
| BB-27 | Dezimalpräzision                  | –                           | Ein-/Auszahlung `0.10 + 0.20`           | Anzeige gerundet auf 2 Dezimalstellen; tolerierbare Rundungsdifferenzen.                                  |
| BB-28 | Menüeingaben mit Leerzeichen      | –                           | ` a`, `e `, `1`                         | Robuste Verarbeitung oder klare Fehlermeldung; keine Exceptions.                                          |

## White-Box-Testkandidaten (Methodenebene)

- Account
    - `deposit(double)` – Normal-/Grenzwerte, negative/NaN/Infinity abweisen (aktuell keine Validierung).
    - `withdraw(double)` – Pfade: Erfolg vs. Saldo zu klein; Grenzwerte 0, genau gleich Saldo.
    - `printBalance()` – Formatierung/Seiteneffekt (optional via Redirect von System.out).
    - `pseudoDeleteAccount()` – Felder auf Null/0 gesetzt; Seiteneffekte prüfen (wird aktuell nicht genutzt).

- Bank
    - `createAccount(String, Currency, double)` – Id-Vergabe, Startsaldo; Konto in Liste.
    - `getAccount(int)` – Trefffall vs. null; Iteration über Liste.
    - `deleteAccount(Account)` – Entfernen aus Liste; Nachricht; Verhalten nach Löschung (Zugriff/contains).
    - `printAccountsList()`, `printOtherAccounts(Account)` – Ausgabe-Formate; Filter (ungleich acc).

- Counter
    - `chooseAccount()` – Eingabe-Validierung per Regex, Verzweigungen für `a/e/w/q` und Zahlen, Fehlerpfade.
    - `editAccount(int)` – Menülogik, Rückgabewerte `true/false` (Schleifensteuerung), `Scanner`-Lebenszyklus.
    - `deposit(Account)`/`withdraw(Account)` – Parse-Pfade, Fehler-Handling, Interaktion mit `Account`.
    - `transfer(Account)` – Zielwahl-Validierung, Fehlerfälle (gleiches Konto, nicht-existent), Schleifen.
    - `transferAmount(Account, Account)` – Pfade: Abheben-Fehler, Währungswechsel, erfolgreiche Buchung.
    - `convertCurrency(double, Currency, Currency)` – Alle If-Pfade, Default-Zweig (keine Umrechnung), Ratio-Korrektheit.
    - `createAccount()` – Regex `[A-Z]{3}` und Mapping auf `Currency`, Default auf USD.
    - `getExchangeRate()` – Regex, Gruppierung, Aufruf `ExchangeRateOkhttp` und Ausgabe.
    - `sayGoodbye()` – Seiteneffekt Ausgabe.

- ExchangeRateOkhttp
    - `getExchangeRate(String, String)` – Erfolgsfall (JSON parse), Fehlerfall (Exception -> 0.0), Body-Handling.

## Verbesserungsvorschläge / Best Practices

- Geldbeträge
    - Verwendung von `BigDecimal` statt `double` für Beträge und Salden; verbindliche Rundungsregeln.
    - Konsistente Formatierung über `NumberFormat`/`Locale`.

- Validierung & Domänenlogik
    - In `Account.deposit/withdraw` Eingaben validieren (nicht-negativ, keine NaN/Infinity) und Exceptions nutzen.
    - Überweisungen atomar behandeln; bei Fehlschlag kein partieller Zustand.
    - Vollständige Währungs-Matrix via Map/Service statt harter If-Kaskaden; Tests dafür.

- Architektur & Testbarkeit
    - Domänelogik von I/O trennen: `System.out` aus `Account`/`Bank` entfernen; Rückgabewerte liefern, Ausgabe im UI-Layer (`Counter`).
    - `Counter`-Abhängigkeiten injizieren (Scanner, HTTP-Client, Exchange-Rate-Service) – erleichtert Unit-Tests (Mocks/Stubs).
    - Fehler per Exceptions/Result-Typen signalisieren statt Konsolen-Strings.

- Codequalität
    - Rechtschreibfehler korrigieren: `AccountExeption` -> `AccountException`.
    - `equals/hashCode` für `Account` bei Bedarf; IDs eindeutig, evtl. `UUID` statt statischem Zähler.
    - `Account.counter` kapseln; IDs nach Löschung stabil halten; Race-Conditions vermeiden.
    - Logging via SLF4J statt `System.out.println`.

- Ressourcen & Sicherheit
    - In `ExchangeRateOkhttp` Response-Body schließen (try-with-resources), Timeouts setzen, Fehlertext robuster behandeln.
    - API-Key nicht hardcoden; über Konfiguration/Environment-Variable laden.

- Tests
    - JUnit 5 einrichten; Unit-Tests für `Account`, `Bank`, `Counter`-Logik (mit eingespritzten Abhängigkeiten) und `ExchangeRateOkhttp` (per Mock).
    - Tests für Grenzwerte und Fehlerpfade (z. B. ungültige Eingaben, API-Fehler, Währungswechsel).

## Vorschlag Teststruktur (Beispiele)

- Unit-Tests
    - `AccountTest`: deposit/withdraw, Grenzwerte, Fehler.
    - `BankTest`: create/get/delete, Listen-Ausgaben via Output-Captor.
    - `CounterTest`: Menüparser und Logik mit Fake-Scanner/Streams; `convertCurrency` Pfade.
    - `ExchangeRateOkhttpTest`: Parsen mit Beispiel-JSON; Fehlerpfad simulieren (Mock Client).

- Integrations-/Systemtests
    - End-to-End über simulierte Konsoleneingaben (z. B. JLine/Test-Console) für typische Benutzerflows: Konto anlegen → einzahlen → überweisen → löschen → beenden.
