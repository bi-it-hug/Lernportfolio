package ch.bbw.pr.cluedo.model;

public class Weapon {
    
    //Eigenschaftern
    private String name;
    private String type;
    private String material;

    public Weapon(String name, String type, String material) {
        this.name = name;
        this.type = type;
        this.material = material;
    }

    // Getter
    public String getName() {return name;}
    public String getType() {return type;}
    public String getMaterial() {return material;}

    //Setter
    public void setName(String name) {this.name = name;}
    public void setType(String type) {this.type = type;}
    public void setMaterial(String material) {this.material = material;}

    @Override
    public String toString() {
        return "Weapon{" +
            "name='" + name + '\'' +
            ", type='" + type + '\'' +
            ", material='" + material + '\'' +
            '}';
    }
}
