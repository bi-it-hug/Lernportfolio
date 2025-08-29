
public class Item {

    public int id;
    public String name;
    public double weight;

    public Item(int id, String name, double weight) {
        this.id = id;
        this.name = name;
        this.weight = weight;
    }

    public String getName() {
        return this.name;
    }
}
