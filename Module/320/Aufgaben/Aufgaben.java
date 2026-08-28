import java.util.Scanner;

public class Aufgaben {

    public static void aufgabe_1() {
        for (int num = 1; num <= 10; num++) {

            int next_num = num;

            while (next_num <= num * 10) {
                System.out.print(next_num + " ");
                next_num += num;
            }

            System.out.println();
        }
    }

    public static void aufgabe_2(Scanner input) {
        System.out.print("\nGeben Sie die Höhe der Dreiecke ein: ");
        int height = input.nextInt();

        System.out.print("Geben Sie die Anzahl der Dreiecke ein: ");
        int amount = input.nextInt();

        System.out.println();
        
        for (int x = 1; x <= height; x++) {

            for (int q = 0; q < amount; q++) {

                for (int y = height - x; y > 0; y--) {
                    System.out.print(" ");
                }
                
                for (int z = 1; z <= 2 * x - 1; z++) {
                    System.out.print("x");
                }

                for (int c = height - x; c > 0; c--) {
                    System.out.print(" ");
                }
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            aufgabe_1();
            aufgabe_2(input);
        }
    }
}
