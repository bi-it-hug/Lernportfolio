# Lernportfolio

## 2024-01-25
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
