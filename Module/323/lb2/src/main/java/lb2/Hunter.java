package lb2;

import java.time.LocalDate;

public class Hunter implements Comparable<Hunter> {
    private String name;
    private int insight;
    private boolean transformed;
    private LocalDate huntStart;
    private Weapon weapon;

    public Hunter(String name, int insight, boolean transformed, LocalDate huntStart, Weapon weapon) {
        this.name = name;
        this.insight = insight;
        this.transformed = transformed;
        this.huntStart = huntStart;
        this.weapon = weapon;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getInsight() {
        return insight;
    }

    public void setInsight(int insight) {
        this.insight = insight;
    }

    public boolean isTransformed() {
        return transformed;
    }

    public void setTransformed(boolean transformed) {
        this.transformed = transformed;
    }

    public LocalDate getHuntStart() {
        return huntStart;
    }

    public void setHuntStart(LocalDate huntStart) {
        this.huntStart = huntStart;
    }

    public Weapon getWeapon() {
        return weapon;
    }

    public void setWeapon(Weapon weapon) {
        this.weapon = weapon;
    }

    @Override
    public int compareTo(Hunter other) {
        return this.name.compareTo(other.name);
    }
}
