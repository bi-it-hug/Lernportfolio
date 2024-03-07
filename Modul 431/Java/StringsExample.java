public class StringsExample {
    public static void main(String[] args) {
        String str1 = "Hello";
        String str2 = "World";

        // Verkettung von Strings
        String combinedString = str1 + " " + str2;
        System.out.println("Kombinierter String: " + combinedString); // Ausgabe: Hello World

        // Länge eines Strings
        System.out.println("Länge des kombinierten Strings: " + combinedString.length()); // Ausgabe: 11

        // Vergleich von Strings
        System.out.println("Ist str1 gleich str2? " + str1.equals(str2)); // Ausgabe: false
    }
}