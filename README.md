# Lernportfolio

## Einfacher Java Taschenrechner

````java
import java.util.Scanner;
public class Calculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("\nZahl 1:");
        int x = scanner.nextInt();
        scanner.nextLine();

        System.out.println("\nOperator:");
        String y = scanner.nextLine();

        System.out.println("\nZahl 2:");
        int z = scanner.nextInt();
        scanner.close();

        String res_msg = "\nResultat:";

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
    }
}
````

### Syntax Erklärung:

````java
import java.util.Scannner;
````
Importiert die Scanner-Klasse aus dem ``java Java.util`` -Paket. Der Scanner wird verwendet, um Benutzereingaben (Inputs) von der Konsole zu lesen.<br>

````java
public class Calculator {
````


## Gleicher Code in Python
````python
x = int(input("\nZahl 1:"))
y = str(input("\nOperator: "))
z = int(input("\nZahl 2: "))

res_msg = "\nResultat:"

if y == "+":
    print(f"{res_msg}\n{x + z}\n")

elif y == "-":
    print(f"{res_msg}\n{x - z}\n")

elif y == "/":
    print(f"{res_msg}\n{x / z}\n")

elif y == "*":
    print(f"{res_msg}\n{x * z}\n")
````
