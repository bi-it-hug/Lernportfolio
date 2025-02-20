public class WrapperClassesExample {
    public static void main(String[] args) {

        // Verwendung von Integer Wrapper-Klasse
        Integer num1 = Integer.valueOf(10);
        
        // Verwendung von Autoboxing und Unboxing
        int primitiveNum = num1; // Autoboxing
        Integer anotherNum = 30;
        int anotherPrimitiveNum = anotherNum.intValue(); // Unboxing

        System.out.println("primitiveNum: " + primitiveNum); // Ausgabe: 10
        System.out.println("anotherPrimitiveNum: " + anotherPrimitiveNum); // Ausgabe: 30
    }
}