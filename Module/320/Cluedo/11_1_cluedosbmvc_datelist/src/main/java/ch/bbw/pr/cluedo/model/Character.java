package ch.bbw.pr.cluedo.model;

public class Character {

    // Eigenschaften
    private String name;
    private String role;
    private String specialAbility;
    private String personality;

    public Character(String name, String role, String specialAbility, String personality) {
        this.name = name;
        this.role = role;
        this.specialAbility = specialAbility;
        this.personality = personality;
    }

   // Getter
    public String getName() {return name;}
    public String getRole() {return role;}
    public String getSpecialAbility() {return specialAbility;}
    public String getPersonality() {return personality;}

    // Setter
    public void setName(String name) {this.name = name;}
    public void setRole(String role) {this.role = role;}
    public void setSpecialAbility(String specialAbility) {this.specialAbility = specialAbility;}
    public void setPersonality(String personality) {this.personality = personality;}

    @Override
    public String toString() {
        return "Character{" +
            "name='" + name + '\'' +
            ", role='" + role + '\'' +
            ", specialAbility='" + specialAbility + '\'' +
            ", personality='" + personality + '\'' +
            '}';
    }
}
