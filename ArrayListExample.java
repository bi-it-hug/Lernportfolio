import java.util.ArrayList;

public class ArrayListExample {
    public static void main(String[] args) {
        
        // Deklaration und Initialisierung einer ArrayList von Strings
        ArrayList<String> names = new ArrayList<>();

        // Hinzufügen von Elementen zur ArrayList
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");

        // Zugriff auf ein Element
        System.out.println("Das zweite Element: " + names.get(1)); // Ausgabe: Bob

        // Iteration durch die ArrayList
        for (String name : names) {
            System.out.println("Name: " + name);
        }
    }
}