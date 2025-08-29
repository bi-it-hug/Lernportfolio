import java.util.Scanner;

public class geometry {
    
    static Scanner input = new Scanner(System.in);

    public static void askForLoop() {

        System.out.println("Eine weitere Berechnung? [Y]/[N]");
        String userAnswer = input.nextLine();
        System.out.println(userAnswer);

        if (userAnswer.equals("Y")) {
            calcRect();

        } else if (userAnswer.equals("N")) {
            System.out.println("Goodbye");

        } else {
            System.out.println("Error");
            askForLoop();
        }
    }

    public static void calcRect() {

        System.out.println("Enter rectangle length:");
        int rectLength = input.nextInt();

        System.out.println("Enter rectangle width:");
        int rectWidth = input.nextInt();

        int rectScope = ((rectLength * 2) + (rectWidth * 2));
        int rectArea = rectLength * rectWidth;

        System.out.println("Scope: " + rectScope);
        System.out.println("Area: " + rectArea);

        askForLoop();
    }

    public static void main(String[] args) {
        calcRect();
    }
}   