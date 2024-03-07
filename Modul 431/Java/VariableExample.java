public class VariableExample {

    // Globale Variable
    static int globalVariable = 10;

    public static void main(String[] args) {
        
        // Lokale Variable
        int localVariable = 20;

        System.out.println("Globale Variable: " + globalVariable);
        System.out.println("Lokale Variable: " + localVariable);

        // Verwendung verschiedener Datentypen
        int age = 25; // Ganzzahl
        double height = 1.75; // Gleitkommazahl
        char gender = 'M'; // Zeichen
        boolean isStudent = true; // Boolescher Wert
        String name = "John"; // Zeichenkette

        System.out.println("Alter: " + age);
        System.out.println("Größe: " + height);
        System.out.println("Geschlecht: " + gender);
        System.out.println("Ist Student: " + isStudent);
        System.out.println("Name: " + name);
    }
}