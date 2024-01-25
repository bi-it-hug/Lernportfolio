import java.util.Scanner;

public class javaKurztest {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        // 1. if-Verzweigung mit Ganzzahlen
        System.out.println("vorgegebene Zahl: ");
        int number = input.nextInt();

        if (number >= 15 && number <= 20) {
            System.out.println(number + " liegt im Bereich von 15 bis 20");

        } else {
            System.out.println(number + " liegt nicht im Bereich von 15 bis 20");
        }

        input.nextLine();

        // 2. if-Verzweigung mit Zeichenketten
        System.out.println("\nBuchstabe: ");
        char character = input.next().charAt(0);
        
        if (!(character == 'a' || character == 'b' || character == 'c' || character == 'd')) {
            System.out.println(character + " ist kein Kleinbuchstabe der Gruppe a, b, c, d.");

        } else if (character == 'a' || character == 'b') {
            System.out.println(character + " ist ein Kleinbuchstabe der Gruppe a, b.");

        } else if (character == 'c' || character == 'd') {
            System.out.println(character + " ist ein Kleinbuchstabe der Gruppe c, d.");
        }

        System.out.println("");
        input.close();

        // 3. for-Schleife mit Sternchen
        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
        
        // 3. for-Schleife mit Sternchen
        for (int x = 1; x <= 2; x++) {
            for (int i = 1; i <= 5; i++) {
                for (int j = 1; j <= i; j++) {
                    System.out.print("*");
                }
                System.out.println();
            }
        }
    }
}