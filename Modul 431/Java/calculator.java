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