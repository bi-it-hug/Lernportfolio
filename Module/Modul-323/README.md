# Lernjournal

## 2026-05-29

**Lombok** ist eine Java-Bibliothek, die beim Kompilieren aus Annotationen automatisch Standard-Code erzeugt — damit du Getter, Setter, Konstruktoren usw. nicht selbst schreiben musst.

In deinem Projekt steht Lombok in der `pom.xml` als `provided`-Abhängigkeit: Es wird nur zum Kompilieren gebraucht; der erzeugte Code landet in den `.class`-Dateien.

## Was `@Value` in deiner `Customer`-Klasse macht

```6:12:c:\Users\lorenzo.hug\OneDrive - BSFH Berufsfachschule__BSFH\Informatik\Lernportfolio\Module\Modul-323\lb2vorbereitung\src\main\java\lb2vorbereitung\Customer.java
@Value
public class Customer {
    private String firstName;
    private String lastName;
    private Date birthdate;
    private String phone;
}
```

`@Value` erzeugt ein **unveränderliches** Werte-Objekt (Value Object). Lombok generiert ungefähr Folgendes:

| Erzeugter Code                | Zweck                                          |
| ----------------------------- | ---------------------------------------------- |
| Konstruktor mit allen Feldern | `new Customer("Max", "Muster", datum, "079…")` |
| Getter                        | `getFirstName()`, `getLastName()`, …           |
| `equals()` / `hashCode()`     | Kunden anhand der Feldwerte vergleichen        |
| `toString()`                  | Ausgabe aller Felder zum Debuggen              |
| `private final` Felder        | Felder sind final; keine Setter                |

Du schreibst also nur die vier Felder — Lombok ergänzt Konstruktor, Getter, `equals`, `hashCode` und `toString`.

## Weitere häufige Lombok-Annotationen (nicht in deiner Datei)

- `@Getter` / `@Setter` — Getter und/oder Setter
- `@Data` — Getter, Setter, `equals`, `hashCode`, `toString` (veränderliche „Datenklasse“)
- `@Builder` — Builder-API zum schrittweisen Erzeugen von Objekten
- `@NoArgsConstructor` / `@AllArgsConstructor` — Konstruktoren ohne bzw. mit allen Parametern

## Wie es technisch funktioniert

Lombok läuft als **Annotation Processor** während der Kompilierung. Die IDE braucht zusätzlich Lombok-Unterstützung (z. B. die Lombok-Erweiterung), damit Autovervollständigung und Navigation auf den generierten Methoden funktionieren.

**Kurz:** In `Customer.java` macht Lomboks `@Value` aus einer kurzen Feldliste eine vollständige, unveränderliche Datenklasse — ohne dass du den repetitiven Code selbst schreibst.

## 2026-04-10

### Backtracking

**Gefundene Lösung:**

![Lösung](image.png)

---

## 2026-03-06

### Rekursion

In diesem Beispiel ist ein Code der den grössten gemeinsamen Teiler zweier Zahlen berechnet:

```python
def calculate(a, b):
    if b == 0:
        return a
    return calculate(b, a % b)


a = 18
b = 60
result = calculate(a, b)

print(f"Der größte gemeinsame Teiler von {a} und {b} ist {result}!")
```

---

## 2026-02-20

### Rekursion

- **Indirekt**: Eine Methode, die eine andere Methode aufruft, welche wiederum die erste Methode aufruft.

```java
public class Main {
    public static void main(String[] args) {
        test1(10);
    }

    public static void test1(int n) {
        if (n <= 0) return;
        System.out.println("test1: " + n);
        test2(n - 1);
    }

    public static void test2(int n) {
        if (n <= 0) return;
        System.out.println("test2: " + n);
        test1(n - 1);
    }
}
```

- **Direkt**: Eine Methode, die sich selbst aufruft.

```java
public class Main {
    public static void main(String[] args) {
        test(10);
    }

    public static void test(int n) {
        if (n <= 0) return;
        System.out.println(n);
        test(n - 1);
    }
}
```
