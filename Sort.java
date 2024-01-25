import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import java.util.Scanner;

public class Sort {

    static Scanner input = new Scanner(System.in);
    static List<Integer> userList = new ArrayList<>();
    public static void main(String[] args) {

        //Erste Nummer
        System.out.println("\nFirst Number:");
        int firstNumber = input.nextInt();
        userList.add(firstNumber);

        //Zweite Nummer
        System.out.println("\nSecond Number:");
        int secondNumber = input.nextInt();
        userList.add(secondNumber);

        //Dritte Nummer
        System.out.println("\nThird Number:");
        int thirdNumber = input.nextInt();
        userList.add(thirdNumber);

        //Vierte Nummer
        System.out.println("\nFourth Number:");
        int fourthNumber = input.nextInt();
        userList.add(fourthNumber);

        //Absteigend
        Collections.sort(userList);
        System.out.println("\nHighest to lowest: " + userList);

        //Aufsteigend
        Collections.sort(userList, Collections.reverseOrder());
        System.out.println("\nLowest to highest: " + userList + "\n");
    }
}