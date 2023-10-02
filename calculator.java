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
