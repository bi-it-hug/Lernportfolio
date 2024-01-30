public class ComparisonOperatorsExample {
    public static void main(String[] args) {
        int a = 5;
        int b = 10;
        int c = 5;

        // Gleichheit
        System.out.println("Ist a gleich b? " + (a == b)); // false
        System.out.println("Ist a gleich c? " + (a == c)); // true

        // Ungleichheit
        System.out.println("Ist a ungleich b? " + (a != b)); // true

        // Größer als
        System.out.println("Ist a größer als b? " + (a > b)); // false
        System.out.println("Ist b größer als a? " + (b > a)); // true

        // Kleiner als
        System.out.println("Ist a kleiner als b? " + (a < b)); // true

        // Größer oder gleich
        System.out.println("Ist a größer oder gleich c? " + (a >= c)); // true

        // Kleiner oder gleich
        System.out.println("Ist b kleiner oder gleich c? " + (b <= c)); // false
    }
}