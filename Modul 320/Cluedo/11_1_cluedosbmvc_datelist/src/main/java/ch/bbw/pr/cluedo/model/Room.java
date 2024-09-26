package ch.bbw.pr.cluedo.model;

public class Room {
    
    // Eigenschaften
    private String name;
    private int size;

    public Room(String name, int size) {
        this.name = name;
        this.size = size;
    }

    // Getter
    public String getName() {return name;}
    public int getSize() {return size;}
    
    // Setter
    public void setName(String name) {this.name = name;}
    public void setSize(int size) {this.size = size;}

    @Override
    public String toString() {
        return "Weapon{" +
            "name='" + name + '\'' +
            ", size='" + size + '\'' +
            '}';
    }
}
