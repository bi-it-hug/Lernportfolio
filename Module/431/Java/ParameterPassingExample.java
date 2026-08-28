public class ParameterPassingExample {
    public static void main(String[] args) {
        int primitiveVar = 10;
        StringBuilder complexVar = new StringBuilder("Hello");

        // Parameterübergabe nach Wert für primitive Datentypen
        modifyPrimitive(primitiveVar);
        System.out.println("Wert nach modifyPrimitive: " + primitiveVar); // Ausgabe: 10

        // Parameterübergabe nach Referenz für komplexe Datentypen
        modifyComplex(complexVar);
        System.out.println("Wert nach modifyComplex: " + complexVar); // Ausgabe: Hello World
    }

    // Methode zur Änderung eines primitiven Parameters
    public static void modifyPrimitive(int value) {
        value = 20; // Änderung hat keine Auswirkung außerhalb der Methode
    }

    // Methode zur Änderung eines komplexen Parameters
    public static void modifyComplex(StringBuilder value) {
        value.append(" World"); // Änderung wirkt sich außerhalb der Methode aus
    }
}