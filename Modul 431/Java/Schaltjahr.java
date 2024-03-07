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