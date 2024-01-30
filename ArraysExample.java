public class ArraysExample {
    public static void main(String[] args) {
        
        // Deklaration und Initialisierung eines Integer-Arrays
        int[] numbers = {1, 2, 3, 4, 5};

        // Zugriff auf Array-Elemente über Index
        System.out.println("Das dritte Element des Arrays: " + numbers[2]); // Ausgabe: 3

        // Ändern eines Array-Elements
        numbers[0] = 10;

        // Iteration durch das Array
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Element " + i + ": " + numbers[i]);
        }
    }
}