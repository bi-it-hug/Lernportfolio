
import java.util.List;

public class App {

    public static void main(String[] args) {

        List<Animal> allAnimals = List.of(
                new Cat("Whiskers", 4, "small"),
                new Dog("Bruno", 10, "big")
        );

        for (Animal animal : allAnimals) {
            animal.speak();
        }
    }
}
