import java.util.Scanner;

public class TemperatureConverter {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String celsius = "c";
        String fahrenheit = "f";

        System.out.println("\ntype " + celsius + " for celsius\ntype " + fahrenheit + " for fahrenheit\n");

        while (true) {
            String input = scanner.nextLine();

            if (input.equals(celsius)) {
                System.out.println("type in temperature value: ");

                double floatInput = scanner.nextDouble();
                double result = floatInput * (9.0 / 5.0) + 32;

                System.out.println(floatInput + celsius + " is " + result + fahrenheit);
                scanner.close();
                break;
            
            } else if (input.equals(fahrenheit)) {
                System.out.println("type in temperature value: ");

                double floatInput = scanner.nextDouble();
                double result = (floatInput - 32) * (5.0 / 9.0);

                System.out.println(floatInput + fahrenheit + " is " + result + celsius);
                scanner.close();
                break;

            } else {
                System.out.println("invalid input\n");
                }
        }
        scanner.close();
    }
}