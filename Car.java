public class Car {

    // Klassenvariable
    static int numberOfCars = 0;

    // Instanzvariablen
    String brand;
    String model;
    int year;

    // Konstruktor
    public Car(String brand, String model, int year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        numberOfCars++; // Inkrementiere die Anzahl der Autos bei jeder Instanziierung
    }

    // Objektmethoden
    public void start() {
        System.out.println("Das Auto " + brand + " " + model + " startet.");
    }

    public void stop() {
        System.out.println("Das Auto " + brand + " " + model + " stoppt.");
    }

    // Statische Methode
    public static void displayNumberOfCars() {
        System.out.println("Anzahl der Autos: " + numberOfCars);
    }

    public static void main(String[] args) {
        
        // Erstellen von Objekten
        Car car1 = new Car("Toyota", "Corolla", 2020);
        Car car2 = new Car("Honda", "Civic", 2018);

        // Aufrufen von Objektmethoden
        car1.start();
        car2.start();
        car1.stop();
        car2.stop();

        // Aufrufen der statischen Methode
        Car.displayNumberOfCars();
    }
}