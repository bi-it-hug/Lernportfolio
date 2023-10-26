import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;

public class playground {

    static int za = 258; // globale variable
    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        System.out.println("Hello, World!");
        System.out.println(5000);
        String name = "Donut";
        name = "Mom";
        int age = 50;
        double weight = 29.483496723890;
        char letter = 'H';
        System.out.println(name + age + weight + letter);

        scanner.close();

        int x = 6;
        int y = 3;
        System.out.println(x + y);

        final char const_c = 'c';
        System.out.println(const_c);
        int za = 32;
        System.out.println(za); // lokale variablen mit dem gleichen namen einer 
                                // globalen, überschreiben diese
        List<String> listObj = new ArrayList<>();
        listObj.add("Hans");
        listObj.add("Peter");
        listObj.add("Meier");
        System.out.println("List:\n" + listObj);
        

        List<Integer> numbers = new ArrayList<>();
        numbers.add(1);
        numbers.add(2);
        numbers.add(3);
        numbers.add(4);
        numbers.add(5);
        
        int total = 0;
        for (int num : numbers) {
            total += num;
        }

        System.out.println("total: " + total);

    }
}
