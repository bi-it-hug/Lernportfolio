package lb2;

public class Weapon {
    private String name;
    private int damage;
    private double weight;
    private boolean trickWeapon;

    public Weapon(String name, int damage, double weight, boolean trickWeapon) {
        this.name = name;
        this.damage = damage;
        this.weight = weight;
        this.trickWeapon = trickWeapon;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getDamage() {
        return damage;
    }

    public void setDamage(int damage) {
        this.damage = damage;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public boolean isTrickWeapon() {
        return trickWeapon;
    }

    public void setTrickWeapon(boolean trickWeapon) {
        this.trickWeapon = trickWeapon;
    }
}
