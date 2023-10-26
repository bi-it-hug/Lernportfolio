import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;

public class Hello_World {

    static int za = 258; // globale variable
    Scanner scanner = new Scanner(System.in);
    public static void main(String[] args) {

        System.out.println("Hello, World!");
        System.out.println(5000);
        String name = "Donut";
        name = "Mom";
        int age = 50;
        double weight = 29.483496723890;
        char letter = 'H';
        System.out.println(name + age + weight + letter);

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
        
    }
}
