package ch.bbw.pr.cluedo.model;

/**
 * Weapon
 *
 * @author bbwpr
 * @version 16.09.2022
 */
public class Weapon {
   private String description;
   private String material;
   private double weight;
   private int length;

   public Weapon(String description, String material, double weight, int length) {
      this.description = description;
      this.material = material;
      this.weight = weight;
      this.length = length;
   }

   public String getDescription() {
      return description;
   }

   public void setDescription(String description) {
      this.description = description;
   }

   public String getMaterial() {
      return material;
   }

   public void setMaterial(String material) {
      this.material = material;
   }

   public double getWeight() {
      return weight;
   }

   public void setWeight(double weight) {
      this.weight = weight;
   }

   public int getLength() {
      return length;
   }

   public void setLength(int length) {
      this.length = length;
   }

   @Override
   public String toString() {
      return "Weapon{" +
            "description='" + description + '\'' +
            ", material='" + material + '\'' +
            ", weight=" + weight +
            ", length=" + length +
            '}';
   }
}
