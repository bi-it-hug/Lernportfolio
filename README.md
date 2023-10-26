# Lernportfolio

## 2023-10-26

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


## Syntax Erklärung:

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
