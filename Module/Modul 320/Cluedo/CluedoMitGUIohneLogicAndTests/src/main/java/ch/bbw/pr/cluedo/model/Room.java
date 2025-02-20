package ch.bbw.pr.cluedo.model;

/**
 * Room
 * @author Peter Rutschmann
 * @version 16.09.2022
 */
public class Room {
   private String description;
   private String floorCover;
   private int numberOfDoors;
   private int area;

   public Room(String description, String floorCover, int numberOfDoors, int area) {
      this.description = description;
      this.floorCover = floorCover;
      this.numberOfDoors = numberOfDoors;
      this.area = area;
   }

   public String getDescription() {
      return description;
   }

   public void setDescription(String description) {
      this.description = description;
   }

   public String getFloorCover() {
      return floorCover;
   }

   public void setFloorCover(String floorCover) {
      this.floorCover = floorCover;
   }

   public int getNumberOfDoors() {
      return numberOfDoors;
   }

   public void setNumberOfDoors(int numberOfDoors) {
      this.numberOfDoors = numberOfDoors;
   }

   public int getArea() {
      return area;
   }

   public void setArea(int area) {
      this.area = area;
   }

   @Override
   public String toString() {
      return "Room{" +
            "description='" + description + '\'' +
            ", floorCover='" + floorCover + '\'' +
            ", numberOfDoors=" + numberOfDoors +
            ", area=" + area +
            '}';
   }
}
