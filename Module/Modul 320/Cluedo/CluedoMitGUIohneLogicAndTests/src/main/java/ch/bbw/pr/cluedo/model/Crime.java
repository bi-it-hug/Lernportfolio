package ch.bbw.pr.cluedo.model;

import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Crime
 * @author Peter Rutschmann
 * @version 18.09.2022
 */
public class Crime{
   private int actor = 0;
   private int weapon = 0;
   private int scene = 0;

   private List<String> history = new ArrayList<>();

   public int getActor() {
      return actor;
   }

   public void setActor(int actor) {
      this.actor = actor;
   }

   public int getWeapon() {
      return weapon;
   }

   public void setWeapon(int weapon) {
      this.weapon = weapon;
   }

   public int getScene() {
      return scene;
   }

   public void setScene(int scene) {
      this.scene = scene;
   }

   public List<String> getHistory() {
      return history;
   }

   @Override
   public String toString() {
      return "Crime{" +
            "actor=" + actor +
            ", weapon=" + weapon +
            ", scene=" + scene +
            ", history=" + history +
            '}';
   }

   public String crimeToString() {
      return "Crime{" +
            "actor=" + actor +
            ", weapon=" + weapon +
            ", scene=" + scene +
            '}';
   }
}
