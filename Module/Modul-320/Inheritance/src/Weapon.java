
public class Weapon extends Item {

    public String category;
    public int baseDamage;
    public boolean canBeInfused;

    public Weapon(int id, String name, float weight, String category, int damage, boolean canBeInfused) {
        super(id, name, weight);
        this.category = category;
        this.baseDamage = damage;
        this.canBeInfused = canBeInfused;
    }
}
