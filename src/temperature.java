import java.util.Scanner;

public class temperature {
    public static void main(String[] args) {
        Scanner scanner = new Scanner (System.in);

        String celsius = "c";
        String fahrenheit = "f";

        while (true) {
            System.out.println("\ntype" + celsius + "for celcius \ntype" + fahrenheit + "for fahrenheit\n");
            String input = scanner.nextLine();

            if (input.equals(celsius) && input.equals(fahrenheit)) {
                break;
            }

            System.out.print("invalid input");
        scanner.close();
        
        int intInput = Integer.parseInt(input);
        double CtoF = intInput * (9 / 5) + 32;
        System.out.println("your number in fahrenheit: " + CtoF);

        }
    }
}