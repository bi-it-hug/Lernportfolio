
import java.util.List;

public class App {

    static final Weapon sword = new Weapon(1, "Zweihander", 10, "Ultra Greatsword", 145, true);
    static final Ring lifeRing = new Ring(1, "LifeRing", 0.8, "Increase maximum HP by 7%");

    static final List<Item> items = List.of(sword, lifeRing);

    public static void main(String[] args) throws Exception {
        for (Item item : items) {
            System.out.println(item.getName());
        }
    }
}
