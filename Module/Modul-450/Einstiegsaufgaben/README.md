# Einstiegsaufgaben

Arbeiten Sie zu zweit an diesen Aufgaben.
Stellen Sie sicher, dass Ihre Lösungen in Ihrem Repository abgelegt sind.
Zeigen Sie Ihre Lösungen anschliessend der Lehrperson.

## Aufgabe 1

_Welche Formen von Tests kennen Sie aus der Informatik?
Arbeiten Sie zu zweit und erläutern Sie mind. drei Beispiele, die Sie aus der Praxis kennen.
Wie werden die Tests durchgeführt?_

> 1. Funktionales Testen
> 2. Nicht-Funktionales Testen

## Aufgabe 2

_Nennen Sie ein Beispiel eines SW-Fehlers und eines SW-Mangels.
Nennen Sie ein Beispiel für einen hohen Schaden bei einem SW-Fehler._

> **SW-Fehler**: Ein Taschenrechner zeigt bei der Berechnung von `2` \* `2` das Ergebnis `5` an.
>
> **SW-Mangel**: Eine Banking-App unterstützt keine Überweisung ins Ausland, obwohl dies in den Anforderungen vorgesehen war.

## Aufgabe 3

### Fehler im Code:

```js
if (extras >= 3) {
    addonDiscount = 10;
} else if (extras >= 5) {
    addonDiscount = 15;
}
```

**Probleme:**

1. **Reihenfolge der Bedingungen:**
    - `extras >= 3` wird **immer zuerst geprüft**.
    - Wenn `extras = 5` ist, trifft auch `extras >= 3` zu, der zweite Block (`extras >= 5`) wird **nie erreicht**.
    - Ergebnis: grosse Bestellungen (5 oder mehr Extras) bekommen nur 10 % statt 15 %.

2. **Else-if Logik:**
    - Die zweite Bedingung wird nur geprüft, wenn die erste **nicht zutrifft**.
    - Deshalb funktioniert es hier nicht für grössere Zahlen.

### Korrigierte Version:

```js
if (extras >= 5) {
    addonDiscount = 10;
} else if (extras >= 3) {
    addonDiscount = 15;
}
```
