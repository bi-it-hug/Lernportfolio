# Erweiterte Anforderung: Wie Java sortiert

**Modul 323 – LB2 – Funktionales Sortieren**  
**Projekt:** `Hunter` / `Weapon` (Bloodborne-Thema)

Diese Dokumentation erklärt, was Java beim Sortieren unserer `Hunter`-Liste intern macht – insbesondere **Natural Order**, **Reverse Order** und den **Sortieralgorithmus**.

---

## 1. Ausgangslage in unserem Projekt

Unsere Datenklasse `Hunter` implementiert `Comparable<Hunter>`:

```java
@Override
public int compareTo(Hunter other) {
    return this.name.compareTo(other.name);
}
```

Damit definiert `Hunter` eine **natürliche Ordnung** (Natural Order): Jäger werden alphabetisch nach `name` sortiert.

In `Main.java` verwenden wir unter anderem:

```java
Collections.sort(naturalOrder);                    // Teil 1
naturalOrderPart2.sort(Comparator.naturalOrder()); // Teil 2
reverseOrder.sort(Comparator.reverseOrder());      // Teil 2
```

Alle drei Varianten rufen letztlich dieselbe Sortier-Infrastruktur in der Java-Standardbibliothek auf – nur mit unterschiedlichen `Comparator`-Objekten.

---

## 2. Natural Order – wie Java das anwendet

### 2.1 Was ist Natural Order?

**Natural Order** ist die Standard-Sortierreihenfolge eines Typs, die über das Interface `Comparable<T>` festgelegt wird. Eine Klasse definiert sie in der Methode `compareTo(T other)`.

| Rückgabewert von `compareTo` | Bedeutung                                  |
| ---------------------------- | ------------------------------------------ |
| negativ                      | `this` kommt **vor** `other`               |
| `0`                          | beide sind **gleich** (für die Sortierung) |
| positiv                      | `this` kommt **nach** `other`              |

In unserem Fall ruft `Hunter.compareTo()` intern `String.compareTo()` auf – also lexikographische Sortierung nach Unicode-Werten des Namens.

### 2.2 Was passiert bei `Collections.sort(liste)`?

Der Aufruf `Collections.sort(naturalOrder)` ist eine Kurzform. Vereinfacht passiert Folgendes:

1. `Collections.sort(List<T> list)` prüft, ob `T` `Comparable` implementiert.
2. Java ruft intern `list.sort(null)` auf – der `Comparator` ist `null`.
3. `List.sort(null)` verwendet dann automatisch die **natürliche Ordnung** über `Comparable`.

**Wichtig:** `null` als Comparator bedeutet nicht „keine Sortierung“, sondern: _nimm `compareTo()` der Elemente_.

### 2.3 Was macht `Comparator.naturalOrder()`?

`Comparator.naturalOrder()` ist eine **statische Factory-Methode** in `java.util.Comparator`. Sie liefert ein Comparator-Objekt, das bei jedem Vergleich `compareTo()` aufruft:

```java
// Vereinfachte Darstellung (nicht Originalquellcode)
public static <T extends Comparable<? super T>> Comparator<T> naturalOrder() {
    return (a, b) -> a.compareTo(b);
}
```

In `Main.java`:

```java
naturalOrderPart2.sort(Comparator.naturalOrder());
```

ist damit **funktional gleichwertig** zu:

```java
Collections.sort(naturalOrderPart2);
```

Beide sortieren nach `Hunter.compareTo()` → also nach `name` aufsteigend.

### 2.4 Warum gibt es beides – `Comparable` und `Comparator`?

|                     | `Comparable`                       | `Comparator`                            |
| ------------------- | ---------------------------------- | --------------------------------------- |
| Wo definiert?       | In der Klasse selbst (`compareTo`) | Extern, z. B. `HunterInsightComparator` |
| Anzahl Sortierungen | Eine „Standard“-Ordnung            | Beliebig viele alternative Ordnungen    |
| Typisch für         | Natural Order                      | Lambda, anonyme Klasse, Chain           |

`Comparable` sagt: _„So sortiere ich mich standardmässig.“_  
`Comparator` sagt: _„Sortiere nach einem anderen Kriterium – ohne die Klasse zu ändern.“_

---

## 3. Reverse Order – wie Java das anwendet

### 3.1 Aufruf in unserem Projekt

```java
reverseOrder.sort(Comparator.reverseOrder());
```

### 3.2 Was macht `Comparator.reverseOrder()`?

Auch das ist eine Factory-Methode. Sie liefert einen Comparator, der die **natürliche Ordnung umdreht**:

```java
// Vereinfachte Darstellung
public static <T extends Comparable<? super T>> Comparator<T> reverseOrder() {
    return Collections.reverseOrder(); // delegiert weiter
}
```

Intern wird beim Vergleich zweier Elemente `b.compareTo(a)` statt `a.compareTo(b)` verwendet – oder äquivalent: das Ergebnis von `compareTo` wird negiert.

Für unsere `Hunter`-Liste bedeutet das: Sortierung nach `name` **absteigend** (Z → A).

### 3.3 Decorator-Muster

`Comparator.reversed()` (Instanzmethode) und `Comparator.reverseOrder()` (statisch) nutzen das **Decorator-Muster**: Ein bestehender Comparator wird „umhüllt“ und kehrt nur die Vergleichsrichtung um, ohne den Original-`Comparator` zu verändern.

Beispiel mit explizitem Comparator:

```java
Comparator<Hunter> aufsteigend = Comparator.comparing(Hunter::getInsight);
Comparator<Hunter> absteigend   = aufsteigend.reversed();
```

`reverseOrder()` macht dasselbe Konzept, aber direkt auf der Natural Order von `Comparable`.

---

## 4. Wie Java sortiert – der gesamte Ablauf

### 4.1 Von `List.sort()` bis zum Algorithmus

Wenn wir in `Main.java` schreiben:

```java
byInsightClass.sort(new HunterInsightComparator());
```

läuft intern ungefähr diese Kette:

```
List.sort(Comparator)
    → Arrays.sort(Object[], Comparator)     // bei ArrayList
        → TimSort.sort(Object[], Comparator)
```

`ArrayList` speichert Elemente in einem internen `Object[]`. `List.sort()` kopiert nicht die Liste, sondern sortiert dieses Array **in place** (am selben Ort im Speicher).

### 4.2 TimSort – der Standardalgorithmus

Seit Java 7 sortiert Java Objekt-Arrays mit **TimSort** – einem **stabilen**, **adaptiven** Mergesort/Insertionsort-Hybrid.

| Eigenschaft     | Bedeutung                                                                 |
| --------------- | ------------------------------------------------------------------------- |
| **Stabil**      | Elemente mit gleichem Vergleichswert behalten ihre relative Reihenfolge   |
| **Adaptiv**     | Bereits teilweise sortierte Daten werden schneller sortiert               |
| **Komplexität** | Im schlechtesten Fall O(n log n), bei fast sortierten Daten oft schneller |

**Stabilität im Projekt:** Sortieren wir z. B. nach `insight` und zwei Jäger haben `insight = 50`, bleibt ihre ursprüngliche Reihenfolge aus der CSV erhalten.

Primitive Arrays (`int[]`, `double[]`, …) werden mit **Dual-Pivot Quicksort** sortiert – das betrifft unser Projekt direkt nicht, weil wir `List<Hunter>` verwenden.

### 4.3 Was TimSort konkret tut (vereinfacht)

1. Das Array wird in **Runs** (aufsteigende Teilfolgen) zerlegt.
2. Kurze Runs werden per **Binary Insertion Sort** auf Mindestlänge gebracht.
3. Runs werden per **Merge** zusammengeführt – dabei ruft Java immer wieder `Comparator.compare(a, b)` bzw. `compareTo` auf.

Java „versteht“ unsere Daten nicht. Es sieht nur ein Array von `Object`-Referenzen und ruft bei jedem Vergleich unsere Comparator-/Comparable-Logik auf.

### 4.4 Ablauf am Beispiel Natural Order

```
Main: naturalOrderPart2.sort(Comparator.naturalOrder())
  │
  ├─ List.sort erhält Comparator für Natural Order
  │
  ├─ Arrays.sort(objectArray, comparator)
  │
  └─ TimSort vergleicht Paare von Hunter-Objekten
         │
         └─ comparator.compare(a, b)
                └─ a.compareTo(b)
                       └─ a.getName().compareTo(b.getName())
```

Jeder Vergleich wandert also bis zu unserer `compareTo()`-Methode durch.

---

## 5. Comparator Chain – wie Java mehrstufig sortiert

In `Main.java`:

```java
byChain.sort(Comparator
        .comparing(Hunter::isTransformed)
        .thenComparingInt(Hunter::getInsight)
        .thenComparing(Hunter::getName));
```

`thenComparing` baut einen **zusammengesetzten Comparator**. Beim Vergleich:

1. Zuerst `transformed` (boolean)
2. Nur bei Gleichstand (`0`): `insight` (int)
3. Nur bei erneutem Gleichstand: `name` (String)

TimSort merkt sich nicht „nach welchem Feld“ gerade sortiert wird – es ruft nur `compare()` auf. Die gesamte Mehrstufigkeit steckt im einen Comparator-Objekt.

---

## 6. Sortieren über Assoziationen (`Hunter` → `Weapon`)

```java
byWeaponDamage.sort(Comparator.comparingInt(hunter -> hunter.getWeapon().getDamage()));
```

Auch hier gilt: Java vergleicht nur `Hunter`-Objekte. Der Comparator **navigiert** zur verknüpften `Weapon` und liest `damage`. Für TimSort ist das ein normaler Vergleich zweier `Hunter`-Referenzen – die Assoziation ist ausschliesslich in unserem Comparator sichtbar.

---

## 7. Kurzüberblick: Welche API wofür?

| Aufruf in unserem Projekt           | Verwendeter Comparator       | Sortiert nach      |
| ----------------------------------- | ---------------------------- | ------------------ |
| `Collections.sort(liste)`           | `null` → Natural Order       | `name` ↑           |
| `Comparator.naturalOrder()`         | Factory für `compareTo`      | `name` ↑           |
| `Comparator.reverseOrder()`         | umgekehrte Natural Order     | `name` ↓           |
| `new HunterInsightComparator()`     | eigene Klasse                | `insight` ↑        |
| Anonyme Klasse                      | `compare` nach `huntStart`   | Datum ↑            |
| Lambda                              | `compare` nach `transformed` | `false` vor `true` |
| `comparing(...).thenComparing(...)` | Chain                        | mehrere Kriterien  |

---

## 8. Zusammenfassung

1. **Natural Order** kommt aus `Comparable.compareTo()`. `Collections.sort(liste)` und `Comparator.naturalOrder()` nutzen dieselbe Logik.
2. **Reverse Order** kehrt nur die Vergleichsrichtung um – bei uns: Namen absteigend.
3. **Java sortiert** über `List.sort` → `Arrays.sort` → **TimSort** (stabil, O(n log n)).
4. Java kennt unsere Domäne nicht – es ruft wiederholt `compare()` / `compareTo()` auf; die Sortierlogik liegt vollständig in unseren Comparators und in `Hunter.compareTo()`.

Damit sind die Aspekte der erweiterten Anforderung „Tiefes Eintauchen“ für dieses Projekt dokumentiert.
