# Lernportfolio

## 2024-01-30
### [N4-Call_by](ParameterPassingExample.java)

Die beiden Parameterübergabe-Konzepte in Java sind:

1. **By Value (nach Wert):** Bei der Übergabe von Parametern nach Wert wird eine Kopie des Werts der Variable an die Methode übergeben. Jegliche Änderungen an der Parametervariable innerhalb der Methode haben keine Auswirkungen auf die ursprüngliche Variable außerhalb der Methode.

2. **By Reference (nach Referenz):** Bei der Übergabe von Parametern nach Referenz wird die Adresse (Referenz) der Variable an die Methode übergeben. Dadurch können Änderungen an der Parametervariable innerhalb der Methode sich auf die ursprüngliche Variable außerhalb der Methode auswirken.

Hier ist ein Codebeispiel, das den Unterschied zwischen den beiden Konzepten zeigt:

```java
public class ParameterPassingExample {
    public static void main(String[] args) {
        int primitiveVar = 10;
        StringBuilder complexVar = new StringBuilder("Hello");

        // Parameterübergabe nach Wert für primitive Datentypen
        modifyPrimitive(primitiveVar);
        System.out.println("Wert nach modifyPrimitive: " + primitiveVar); // Ausgabe: 10

        // Parameterübergabe nach Referenz für komplexe Datentypen
        modifyComplex(complexVar);
        System.out.println("Wert nach modifyComplex: " + complexVar); // Ausgabe: Hello World
    }

    // Methode zur Änderung eines primitiven Parameters
    public static void modifyPrimitive(int value) {
        value = 20; // Änderung hat keine Auswirkung außerhalb der Methode
    }

    // Methode zur Änderung eines komplexen Parameters
    public static void modifyComplex(StringBuilder value) {
        value.append(" World"); // Änderung wirkt sich außerhalb der Methode aus
    }
}
```

In diesem Beispiel wird `primitiveVar` als Parameter nach Wert und `complexVar` als Parameter nach Referenz übergeben. Nach dem Aufruf der beiden Methoden `modifyPrimitive` und `modifyComplex` wird der Wert von `primitiveVar` nicht geändert, da er nach Wert übergeben wurde. Im Gegensatz dazu wird der Wert von `complexVar` geändert, da er nach Referenz übergeben wurde.

***

### N3-Composite_Datatypes

[ArraysExample](ArraysExample.java)<br>
[StringsExample](StringsExample.java)<br>
[ArrayListExample](ArrayListExample.java)<br>
[WrapperClassesExample](WrapperClassesExample.java)

Hier ist eine Erklärung zu den genannten zusammengesetzten Datentypen in Java mit Beispielen für deren Verwendung:

1. **Arrays:** Arrays sind eine Sammlung von Elementen des gleichen Datentyps, die in einer festen Größe deklariert werden. Sie bieten einen effizienten Weg, um mehrere Elemente desselben Typs zu speichern und zu verwalten.

```java
public class ArraysExample {
    public static void main(String[] args) {

        // Deklaration und Initialisierung eines Integer-Arrays
        int[] numbers = {1, 2, 3, 4, 5};

        // Zugriff auf Array-Elemente über Index
        System.out.println("Das dritte Element des Arrays: " + numbers[2]); // Ausgabe: 3

        // Ändern eines Array-Elements
        numbers[0] = 10;

        // Iteration durch das Array
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Element " + i + ": " + numbers[i]);
        }
    }
}
```

2. **Strings:** Strings sind in Java eine spezielle Klasse zur Verarbeitung von Zeichenketten. Sie sind unveränderlich, was bedeutet, dass ihr Inhalt nach der Initialisierung nicht geändert werden kann.

```java
public class StringsExample {
    public static void main(String[] args) {
        String str1 = "Hello";
        String str2 = "World";

        // Verkettung von Strings
        String combinedString = str1 + " " + str2;
        System.out.println("Kombinierter String: " + combinedString); // Ausgabe: Hello World

        // Länge eines Strings
        System.out.println("Länge des kombinierten Strings: " + combinedString.length()); // Ausgabe: 11

        // Vergleich von Strings
        System.out.println("Ist str1 gleich str2? " + str1.equals(str2)); // Ausgabe: false
    }
}
```

3. **ArrayList:** ArrayList ist eine dynamische Array-Implementierung in Java, die es ermöglicht, Elemente dynamisch hinzuzufügen und zu entfernen. Sie ist Teil der Java Collections Framework.

```java
import java.util.ArrayList;

public class ArrayListExample {
    public static void main(String[] args) {

        // Deklaration und Initialisierung einer ArrayList von Strings
        ArrayList<String> names = new ArrayList<>();

        // Hinzufügen von Elementen zur ArrayList
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");

        // Zugriff auf ein Element
        System.out.println("Das zweite Element: " + names.get(1)); // Ausgabe: Bob

        // Iteration durch die ArrayList
        for (String name : names) {
            System.out.println("Name: " + name);
        }
    }
}
```

4. **Wrapper-Klassen:** Wrapper-Klassen dienen dazu, primitive Datentypen in Objekte umzuwandeln, da Java keine direkten Methoden für primitive Datentypen bereitstellt.

```java
public class WrapperClassesExample {
    public static void main(String[] args) {

        // Verwendung von Integer Wrapper-Klasse
        Integer num1 = Integer.valueOf(10);

        // Verwendung von Autoboxing und Unboxing
        int primitiveNum = num1; // Autoboxing
        Integer anotherNum = 30;
        int anotherPrimitiveNum = anotherNum.intValue(); // Unboxing

        System.out.println("primitiveNum: " + primitiveNum); // Ausgabe: 10
        System.out.println("anotherPrimitiveNum: " + anotherPrimitiveNum); // Ausgabe: 30
    }
}
```

Diese Beispiele demonstrieren die Verwendung von Arrays, Strings, ArrayList und Wrapper-Klassen in Java.

***

### [N2-Logicals](ComparisonOperatorsExample.java)

Vergleichsoperatoren in Java werden verwendet, um die Beziehung zwischen zwei Operanden zu überprüfen und das Ergebnis als Wahr oder Falsch (true oder false) auszudrücken. Hier sind die häufig verwendeten Vergleichsoperatoren:

- `==`: Gleichheit
- `!=`: Ungleichheit
- `>`: Größer als
- `<`: Kleiner als
- `>=`: Größer oder gleich
- `<=`: Kleiner oder gleich

Hier ist ein Codebeispiel, das die Verwendung von Vergleichsoperatoren in Java zeigt:

```java
public class ComparisonOperatorsExample {
    public static void main(String[] args) {
        int a = 5;
        int b = 10;
        int c = 5;

        // Gleichheit
        System.out.println("Ist a gleich b? " + (a == b)); // false
        System.out.println("Ist a gleich c? " + (a == c)); // true

        // Ungleichheit
        System.out.println("Ist a ungleich b? " + (a != b)); // true

        // Größer als
        System.out.println("Ist a größer als b? " + (a > b)); // false
        System.out.println("Ist b größer als a? " + (b > a)); // true

        // Kleiner als
        System.out.println("Ist a kleiner als b? " + (a < b)); // true

        // Größer oder gleich
        System.out.println("Ist a größer oder gleich c? " + (a >= c)); // true

        // Kleiner oder gleich
        System.out.println("Ist b kleiner oder gleich c? " + (b <= c)); // false
    }
}
```

In diesem Beispiel vergleichen wir die Werte von Variablen `a`, `b` und `c` mithilfe verschiedener Vergleichsoperatoren und geben das Ergebnis auf der Konsole aus.

***

### [N2-Classes_Objects_Methods](Car.java)

In Java ist eine Klasse ein Bauplan oder eine Vorlage, die verwendet wird, um Objekte zu erstellen. Ein Objekt ist eine Instanz einer Klasse, das heißt, es ist eine konkrete Realisierung des Klassenbauplans. Eine Instanzvariable ist eine Variable, die einem spezifischen Objekt zugeordnet ist und deren Werte unterschiedlich sein können, während eine Klassenvariable eine Variable ist, die von allen Instanzen einer Klasse gemeinsam genutzt wird. Eine (Objekt-)Methode ist eine Funktion oder ein Verhalten, das von einem Objekt ausgeführt werden kann.

Eine statische Methode ist eine Methode, die mit der Klasse selbst und nicht mit einzelnen Objekten dieser Klasse verknüpft ist. Sie kann aufgerufen werden, ohne dass ein Objekt der Klasse instanziiert werden muss.

Hier ist ein Codebeispiel, das die Verwendung von Klassen, Objekten, Instanzvariablen, Methoden, Klassenvariablen und statischen Methoden in Java zeigt:

```java
public class Car {

    // Klassenvariable
    static int numberOfCars = 0;

    // Instanzvariablen
    String brand;
    String model;
    int year;

    // Konstruktor
    public Car(String brand, String model, int year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        numberOfCars++; // Inkrementiere die Anzahl der Autos bei jeder Instanziierung
    }

    // Objektmethoden
    public void start() {
        System.out.println("Das Auto " + brand + " " + model + " startet.");
    }

    public void stop() {
        System.out.println("Das Auto " + brand + " " + model + " stoppt.");
    }

    // Statische Methode
    public static void displayNumberOfCars() {
        System.out.println("Anzahl der Autos: " + numberOfCars);
    }

    public static void main(String[] args) {

        // Erstellen von Objekten
        Car car1 = new Car("Toyota", "Corolla", 2020);
        Car car2 = new Car("Honda", "Civic", 2018);

        // Aufrufen von Objektmethoden
        car1.start();
        car2.start();
        car1.stop();
        car2.stop();

        // Aufrufen der statischen Methode
        Car.displayNumberOfCars();
    }
}
```

In diesem Beispiel repräsentiert die Klasse `Car` einen Autotyp. Wir haben Instanzvariablen wie `brand`, `model` und `year`, die spezifisch für jedes Autoobjekt sind. Die Methoden `start` und `stop` sind Objektmethoden, die spezifische Aktionen für jedes Auto ausführen. Die Klassenvariable `numberOfCars` wird verwendet, um die Anzahl der instanziierten Autos zu verfolgen, und die statische Methode `displayNumberOfCars` gibt diese Anzahl aus.

***

### [N1-Variables_Constants](VariableExample.java)

Variablen in Java können verschiedene Datentypen haben und entweder global oder lokal sein. Hier ist eine Erklärung mit Beispielen:

1. **Datentypen:**
   - **Primitive Datentypen:** Diese repräsentieren einfache Werte wie ganze Zahlen, Gleitkommazahlen, Zeichen usw.
   - **Referenzdatentypen:** Diese sind Referenzen auf Objekte und schließen Klassen, Schnittstellen und Arrays ein.

2. **Globale Variablen:**
   - Globale Variablen sind Variablen, die außerhalb von Methoden, Konstruktoren oder Blöcken in einer Klasse deklariert werden. Sie sind für alle Methoden in der Klasse sichtbar.
   - Sie werden oft verwendet, um Daten zentral für die Klasse zu speichern.

3. **Lokale Variablen:**
   - Lokale Variablen sind Variablen, die innerhalb eines Blocks oder einer Methode deklariert werden und nur innerhalb dieses Blocks oder dieser Methode sichtbar sind.
   - Sie haben normalerweise eine begrenzte Lebensdauer und existieren nur, solange die Methode oder der Block ausgeführt wird.

Hier ist ein Codebeispiel, das die Verwendung von globalen und lokalen Variablen sowie verschiedene Datentypen in Java zeigt:

```java
public class VariableExample {

    // Globale Variable
    static int globalVariable = 10;

    public static void main(String[] args) {

        // Lokale Variable
        int localVariable = 20;

        System.out.println("Globale Variable: " + globalVariable);
        System.out.println("Lokale Variable: " + localVariable);

        // Verwendung verschiedener Datentypen
        int age = 25; // Ganzzahl
        double height = 1.75; // Gleitkommazahl
        char gender = 'M'; // Zeichen
        boolean isStudent = true; // Boolescher Wert
        String name = "John"; // Zeichenkette

        System.out.println("Alter: " + age);
        System.out.println("Größe: " + height);
        System.out.println("Geschlecht: " + gender);
        System.out.println("Ist Student: " + isStudent);
        System.out.println("Name: " + name);
    }
}
```

In diesem Beispiel ist `globalVariable` eine globale Variable, die außerhalb der `main`-Methode deklariert ist, während `localVariable` eine lokale Variable innerhalb der `main`-Methode ist. Die verschiedenen Datentypen werden ebenfalls verwendet, um unterschiedliche Arten von Daten zu speichern.

***

### [N1-Flow_Control](ControlFlowExample.java)

Kontrollfluss in Java bezieht sich auf die Reihenfolge, in der Anweisungen innerhalb eines Programms ausgeführt werden, basierend auf verschiedenen Bedingungen und Schleifen. Die Steuerung des Programmablaufs beinhaltet die Verwendung von Bedingungen, um Entscheidungen zu treffen, und Schleifen, um Anweisungen mehrmals auszuführen. In Java gibt es verschiedene Bedingungen und Möglichkeiten des Kontrollflusses, darunter:

1. **Bedingungen (if-else-Anweisungen):**
   - `if`: Führt eine Anweisung aus, wenn die Bedingung wahr ist.
   - `else`: Führt eine alternative Anweisung aus, wenn die Bedingung in einem `if`-Block falsch ist.
   - `else if`: Fügt eine weitere Bedingung hinzu, die überprüft wird, wenn die vorherigen Bedingungen falsch sind.

2. **Schleifen:**
   - `for`: Eine Schleife, die eine Anweisungsfolge eine bestimmte Anzahl von Malen wiederholt.
   - `while`: Eine Schleife, die eine Anweisungsfolge wiederholt, solange eine Bedingung wahr ist.
   - `do-while`: Eine Schleife, die eine Anweisungsfolge mindestens einmal ausführt und dann wiederholt, solange eine Bedingung wahr ist.

Hier ist ein Codebeispiel, das die Verwendung von Bedingungen und Schleifen im Kontrollfluss in Java zeigt:

```java
public class ControlFlowExample {
    public static void main(String[] args) {
        int number = 10;

        // Bedingungen
        if (number > 0) {
            System.out.println("Die Zahl ist positiv.");

        } else if (number < 0) {
            System.out.println("Die Zahl ist negativ.");

        } else {
            System.out.println("Die Zahl ist Null.");
        }

        // Schleifen
        System.out.println("Schleife mit for:");
        for (int i = 0; i < 5; i++) {
            System.out.println("Wert von i: " + i);
        }

        System.out.println("Schleife mit while:");
        int j = 0;

        while (j < 5) {
            System.out.println("Wert von j: " + j);
            j++;
        }

        System.out.println("Schleife mit do-while:");
        int k = 0;

        do {
            System.out.println("Wert von k: " + k);
            k++;

        } while (k < 5);
    }
}
```

In diesem Beispiel werden Bedingungen verwendet, um zu überprüfen, ob eine Zahl positiv, negativ oder Null ist. Außerdem werden verschiedene Arten von Schleifen (`for`, `while`, `do-while`) verwendet, um Anweisungen mehrmals auszuführen, basierend auf verschiedenen Bedingungen.

***

## 2024-01-03
### [InventoryManagementSystem](InventoryManagementSystem.java)

~~~~java
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class InventoryManagementSystem {
    private static Map<String, Integer> inventory = new HashMap<>();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        boolean running = true;

        while (running) {
            System.out.println("\nInventory Management System");
            System.out.println("1. Add item to inventory");
            System.out.println("2. Display inventory");
            System.out.println("3. Sell item");
            System.out.println("4. Restock item");
            System.out.println("5. Exit");
            System.out.print("Enter your choice: ");
            
            int choice = scanner.nextInt();
            scanner.nextLine();
            
            switch (choice) {
                case 1:
                    addItemToInventory();
                    break;

                case 2:
                    displayInventory();
                    break;

                case 3:
                    sellItem();
                    break;

                case 4:
                    restockItem();
                    break;

                case 5:
                    running = false;
                    break;

                default:
                    System.out.println("Invalid choice. Please enter a number between 1 and 5.");
            }
        }
        scanner.close();
        System.out.println("Exiting Inventory Management System. Goodbye!");
    }

    private static void addItemToInventory() {
        System.out.print("Enter the name of the item: ");
        String itemName = scanner.nextLine();

        System.out.print("Enter the quantity: ");
        int quantity = scanner.nextInt();
        
        if (inventory.containsKey(itemName)) {
            int currentQuantity = inventory.get(itemName);
            inventory.put(itemName, currentQuantity + quantity);

        } else {
            inventory.put(itemName, quantity);
        }
        System.out.println(quantity + " " + itemName + "(s) added to inventory.");
    }

    private static void displayInventory() {
        System.out.println("\nCurrent Inventory:");

        for (Map.Entry<String, Integer> entry : inventory.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }

    private static void sellItem() {
        System.out.print("Enter the name of the item to sell: ");
        String itemName = scanner.nextLine();
        
        if (inventory.containsKey(itemName)) {
            System.out.print("Enter the quantity to sell: ");
            int quantityToSell = scanner.nextInt();
            int availableQuantity = inventory.get(itemName);

            if (availableQuantity >= quantityToSell) {
                inventory.put(itemName, availableQuantity - quantityToSell);
                System.out.println(quantityToSell + " " + itemName + "(s) sold.");
                
            } else {
                System.out.println("Insufficient quantity available.");
            }
        } else {
            System.out.println("Item not found in inventory.");
        }
    }

    private static void restockItem() {
        System.out.print("Enter the name of the item to restock: ");
        String itemName = scanner.nextLine();
        
        if (inventory.containsKey(itemName)) {
            System.out.print("Enter the quantity to restock: ");
            int quantityToRestock = scanner.nextInt();
            
            int currentQuantity = inventory.get(itemName);
            inventory.put(itemName, currentQuantity + quantityToRestock);
            System.out.println(quantityToRestock + " " + itemName + "(s) restocked.");
            
        } else {
            System.out.println("Item not found in inventory.");
        }
    }
}
~~~~

## Erklärung:

1. `import java.util.HashMap;`: Diese Zeile importiert die `HashMap`-Klasse aus dem Paket `java.util`. Eine HashMap ist eine Datenstruktur, die eine Zuordnung von Schlüssel-Wert-Paaren ermöglicht.

2. `import java.util.Map;`: Diese Zeile importiert die `Map`-Schnittstelle aus dem Paket `java.util`. Eine Map ist eine abstrakte Datenstruktur, die eine Zuordnung von Schlüssel-Wert-Paaren definiert.

3. `import java.util.Scanner;`: Diese Zeile importiert die `Scanner`-Klasse aus dem Paket `java.util`. Ein Scanner wird verwendet, um Benutzereingaben von der Konsole zu lesen.

4. `public class InventoryManagementSystem {`: Hier beginnt die Definition einer neuen Java-Klasse mit dem Namen `InventoryManagementSystem`.

5. `private static Map<String, Integer> inventory = new HashMap<>();`: Dies definiert eine statische Klassenvariable `inventory`, die eine HashMap ist, die Strings (für den Namen des Artikels) mit Ganzzahlen (für die Anzahl des Artikels im Bestand) verknüpft.

6. `private static Scanner scanner = new Scanner(System.in);`: Dies definiert eine statische Klassenvariable `scanner`, die einen neuen Scanner für die Standardeingabe (`System.in`) initialisiert, um Benutzereingaben zu lesen.

7. `public static void main(String[] args) {`: Hier beginnt die Definition der Hauptmethode der Klasse.

8. `boolean running = true;`: Eine Variable `running` wird initialisiert, um den Zustand des Programms zu verfolgen und die Schleife auszuführen oder zu beenden.

9. `while (running) {`: Beginn einer Schleife, die so lange ausgeführt wird, wie `running` den Wert `true` hat.

10. `System.out.println("\nInventory Management System");`: Gibt eine Zeichenfolge aus, die den Benutzer darüber informiert, dass es sich um ein Inventarverwaltungssystem handelt.

11. `System.out.println("1. Add item to inventory");`: Gibt eine Zeichenfolge aus, die den Benutzer darüber informiert, dass er einen Artikel zum Inventar hinzufügen kann.

12. `System.out.println("2. Display inventory");`: Gibt eine Zeichenfolge aus, die den Benutzer darüber informiert, dass er das Inventar anzeigen kann.

13. `System.out.println("3. Sell item");`: Gibt eine Zeichenfolge aus, die den Benutzer darüber informiert, dass er einen Artikel verkaufen kann.

14. `System.out.println("4. Restock item");`: Gibt eine Zeichenfolge aus, die den Benutzer darüber informiert, dass er einen Artikel nachfüllen kann.

15. `System.out.println("5. Exit");`: Gibt eine Zeichenfolge aus, die den Benutzer darüber informiert, dass er das Programm beenden kann.

16. `System.out.print("Enter your choice: ");`: Gibt eine Aufforderung aus, in der der Benutzer aufgefordert wird, seine Auswahl einzugeben.

17. `int choice = scanner.nextInt();`: Liest die Eingabe des Benutzers als Ganzzahl und speichert sie in der Variable `choice`.

18. `scanner.nextLine();`: Leert den Scanner-Puffer, um das neue Zeilenende nach der vorherigen Eingabe zu verbrauchen.

19. `switch (choice) {`: Beginn einer Switch-Anweisung, um je nach Benutzerwahl verschiedene Aktionen auszuführen.

20. `case 1:`: Fall, wenn der Benutzer "1" wählt, um einen Artikel zum Inventar hinzuzufügen.

21. `addItemToInventory();`: Ruft die Methode `addItemToInventory()` auf, um einen Artikel zum Inventar hinzuzufügen.

22. `break;`: Beendet den Switch-Block und geht aus der Schleife, um die Benutzerwahl erneut zu erhalten.

23. Weitere Fälle (case 2, case 3, case 4) und ihre entsprechenden Methodenaufrufe (displayInventory(), sellItem(), restockItem()) werden ähnlich behandelt.

24. `case 5:`: Fall, wenn der Benutzer "5" wählt, um das Programm zu beenden.

25. `running = false;`: Setzt die Variable `running` auf `false`, um die Schleife zu beenden.

26. `default:`: Standardfall, der ausgeführt wird, wenn der Benutzer eine ungültige Auswahl trifft.

27. `scanner.close();`: Schließt den Scanner, um Ressourcen freizugeben.

28. `System.out.println("Exiting Inventory Management System. Goodbye!");`: Gibt eine Abschiedsnachricht aus, wenn das Programm beendet wird.

29. Die Methoden `addItemToInventory()`, `displayInventory()`, `sellItem()` und `restockItem()` führen jeweils spezifische Aktionen im Inventar aus, je nach Benutzerinteraktion. Jede Methode liest Benutzereingaben, verarbeitet sie und aktualisiert das Inventar entsprechend.

***

## 2023-10-26
### [Schaltjahr](Schaltjahr.java)

~~~~java
import java.util.Scanner;

public class Schaltjahr {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.println("\nJahr:");
        int year = input.nextInt();
        input.nextLine();
        input.close();

        boolean isLeapYear = false;

        // Überprüft ob das eingegebene Jahr durch 4 teilbar ist
        if (year % 4 == 0) {
            isLeapYear = true;

            // Überprüft ob das eingegebene Jahr durch 100 teilbar ist
            if (year % 100 == 0) {
                isLeapYear = false;

                // Überprüft ob das eingegebene Jahr durch 400 teilbar ist
                if (year % 400 == 0) {
                    isLeapYear = true;
                }
            }
        }

        if (isLeapYear) {
            System.out.println(year + " ist ein Schaltjahr");
        } else {
            System.out.println(year + " ist kein Schaltjahr");
        }
    }
}
~~~~

## Erklärung:

~~~~java
if (year % 4 == 0) {
    isLeapYear = false;
}
~~~~
Der Modulo Operator `%` wird benutzt um zu überprüfen ob das Resultat von `year` geteilt durch 4 eine gerade Zahl ist.

***

## 2023-09-28
### [Einfacher Java Taschenrechner](calculator.java)

~~~~java
import java.util.Scanner;

public class Calculator {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        // Fragt den Benutzer nach der ersten Zahl
        System.out.println("\nZahl 1:");
        int num1 = input.nextInt();
        input.nextLine();

        // Fragt den Benutzer nach dem Operationszeichen
        System.out.println("\nOperationszeichen:");
        String operator = input.nextLine();
        
        // Fragt den Benutzer nach der ersten Zahl
        System.out.println("\nZahl 2:");
        int num2 = input.nextInt();
        input.close();

        // Ausgabe der beiden Zahlen mit dem "+" Operationszeichen
        if (operator.equals("+")) {
            System.out.println("\nResultat:\n" +  (num1 + num2) + "\n");
        }

        // Ausgabe der beiden Zahlen mit dem "-" Operationszeichen
        else if (operator.equals("-")) {
            System.out.println("\nResultat:\n" +  (num1 - num2) + "\n");
        }

        // Ausgabe der beiden Zahlen mit dem "*" Operationszeichen
        else if (operator.equals("*")) {
            System.out.println("\nResultat:\n" +  (num1 * num2) + "\n");
        }

        // Ausgabe der beiden Zahlen mit dem "/" Operationszeichen
        else if (operator.equals("/")) {
            System.out.println("\nResultat:\n" +  (num1 / num2) + "\n");
        }
    }
}
~~~~

## Erklärung:

~~~~java
import java.util.Scanner;
~~~~

> Importiert die Scanner-Klasse aus dem `Java.util` -Paket. Der Scanner wird verwendet, um Benutzereingaben (Inputs) von der Konsole zu lesen.

~~~~java
public class Calculator {
~~~~
 > Hier wird eine öffentliche Klasse mit dem Namen "Calculator" deklariert. Dies ist die Hauptklasse des Programms.

~~~~java
public static void main(String[] args) {
~~~~
> Dies ist die main-Methode des Programms, die den Einstiegspunkt für die Ausführung darstellt. Sie hat ein `String[] args` -Parameter, der dazu verwendet werden kann, Befehlszeilenargumente zu übergeben, wird in diesem Fall jedoch nicht verwendet.

~~~~java
Scanner scanner = new Scanner(System.in);
~~~~
> In dieser Zeile wird eine Instanz der Scanner-Klasse mit dem Namen "scanner" erstellt. Der Scanner wird mit System.in initialisiert, was bedeutet, dass er auf die Standard-Eingabe (die Konsole) zugreift, um Benutzereingaben zu lesen.

~~~~java
System.out.println("\nZahl 1:");
~~~~
> Diese Zeile gibt den Text "Zahl 1:" in die Konsole aus, um den Benutzer zur Eingabe der ersten Zahl aufzufordern.

~~~~java
int x = scanner.nextInt();
~~~~
> Hier wird die Benutzereingabe für die erste Zahl eingelesen und in der Variablen `x` als Ganzzahl (int) gespeichert. `scanner.nextInt()` erwartet, dass der Benutzer eine Ganzzahl eingibt.

~~~~java
scanner.nextLine();
~~~~
> Diese Zeile wird verwendet, um den Zeilenumbruch (newline character) nach der vorherigen Eingabe zu verarbeiten und sicherzustellen, dass die nächste Eingabe nicht von der vorherigen Zeile beeinflusst wird.

~~~~java
System.out.println("\nOperator:");
~~~~
> Hier wird der Benutzer aufgefordert, einen Operator einzugeben, der die gewünschte mathematische Operation darstellt.

~~~~java
String y = scanner.nextLine();
~~~~
> Die Benutzereingabe für den Operator wird in der Variable `y` als Zeichenkette (String) gespeichert. `scanner.nextLine()` liest eine gesamte Zeile aus der Konsole, einschließlich des Zeilenumbruchs.

~~~~java
System.out.println("\nZahl 2:");
~~~~
> Der Benutzer wird aufgefordert, die zweite Zahl einzugeben.

~~~~java
int z = scanner.nextInt();
~~~~
> Die Benutzereingabe für die zweite Zahl wird in der Variablen `z` als Ganzzahl gespeichert.

~~~~java
scanner.close();
~~~~
> Der Scanner wird geschlossen, um Ressourcen freizugeben und die Eingabe von der Konsole zu beenden.

~~~~java
String res_msg = "\nResultat:";
~~~~
> Eine Zeichenkette `res_msg` wird erstellt, um das Präfix für die Ausgabe des Ergebnisses zu speichern.

~~~~java
if (y.equals("+")) {
    System.out.println(res_msg + "\n" +  (x + z) + "\n");
}
else if (y.equals("-")) {
    System.out.println(res_msg + "\n" +  (x - z) + "\n");
}
else if (y.equals("/")) {
    System.out.println(res_msg + "\n" +  (x / z) + "\n");
}
else if (y.equals("*")) {
    System.out.println(res_msg + "\n" +  (x * z) + "\n");
}
~~~~
> In den obrigen `if-else if`-Blöcken wird der eingegebene Operator `y` überprüft, und je nachdem, welcher Operator eingegeben wurde (`+`, `-`, `/`, `*`), wird die entsprechende mathematische Operation auf den beiden eingegebenen Zahlen `x` und `z` durchgeführt. Das Ergebnis wird dann auf die Konsole ausgegeben, zusammen mit dem Präfix `res_msg`.
