package ch.bbw.pr.cluedo.model;

import java.awt.*;

/**
 * A Person
 * @author Peter Rutschmann
 * @version 29.08.2022
 */
public class Person {
   private String name;
   private String formOfAddress;
   private Color hairColor;
   private int age;

   public Person(String name, String formOfAddress, Color hairColor, int age) {
      this.name = name;
      this.formOfAddress = formOfAddress;
      this.hairColor = hairColor;
      this.age = age;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getFormOfAddress() { return formOfAddress; }

   public void setFormOfAddress(String formOfAddress) {
      this.formOfAddress = formOfAddress;
   }

   public Color getHairColor() { return hairColor; }

   public void setHairColor(Color hairColor) { this.hairColor = hairColor; }

   public int getAge() { return age; }

   public void setAge(int age) { this.age = age; }

   @Override
   public String toString() {
      return "Person{" +
            "name='" + name + '\'' +
            ", formOfAddress='" + formOfAddress + '\'' +
            ", hairColor=" + hairColor +
            ", age=" + age +
            '}';
   }
}
