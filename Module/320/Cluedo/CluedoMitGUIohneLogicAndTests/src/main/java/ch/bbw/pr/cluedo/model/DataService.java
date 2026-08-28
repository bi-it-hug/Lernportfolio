package ch.bbw.pr.cluedo.model;

import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.List;

/**
 * DataService
 * @author Peter Rutschmann
 * @version 25.10.2022
 */
@Service
public class DataService {
   private final List<Person> persons = List.of(
         new Person("Mustard", "Colonel", Color.DARK_GRAY, 65),
         new Person("Scarlett", "Miss", Color.YELLOW, 25),
         new Person("White", "Mrs", Color.GRAY, 55),
         new Person("Plum", "Professor", Color.BLACK, 60)
   );

   private final List<Weapon> weapons = List.of(
         new Weapon("Pistol", "Steel", 350.0, 12),
         new Weapon("Rope", "Hemp", 1000.0, 1000),
         new Weapon("Tubing", "Copper", 2000, 50),
         new Weapon("Dagger", "Steel", 250, 15)
   );

   private final List<Room> rooms = List.of(
         new Room("Bath", "Fool Panel", 1, 10),
         new Room("Living Room", "Wood", 3, 25),
         new Room("Kitchen", "Fool Panel", 2, 12),
         new Room("Bedroom", "Carpet", 1, 15)
   );

   private Crime suggestion = new Crime();
   private Crime secret = new Crime();
   int numberOfSuggestions = 0;
   final int MAXNUMBEROFSUGGESTIONS = 8;

   public List<Person> getPersons() {return persons;}
   public List<Weapon> getWeapons() { return weapons; }
   public List<Room> getRooms() { return rooms; }

   public Crime getSuggestion() { return suggestion; }
   public Crime getSecret() { return secret;}
   public int getNumberOfSuggestions() { return numberOfSuggestions; }
   public int getMAXNUMBEROFSUGGESTIONS() { return MAXNUMBEROFSUGGESTIONS; }

   @Override
   public String toString() {
      return "DataService{" +
            "persons=" + persons +
            ", weapons=" + weapons +
            ", rooms=" + rooms +
            ", crime=" +  +
            '}';
   }

   public void increaseNumberOfSuggestions(){ numberOfSuggestions++;};
   public void resetGame(){
      suggestion = new Crime();
      secret = new Crime();
      numberOfSuggestions = 0;
   }
}
