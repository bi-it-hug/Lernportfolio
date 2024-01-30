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