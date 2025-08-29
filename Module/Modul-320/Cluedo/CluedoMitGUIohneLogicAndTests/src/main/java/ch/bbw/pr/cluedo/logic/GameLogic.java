package ch.bbw.pr.cluedo.logic;

import ch.bbw.pr.cluedo.model.Crime;
import ch.bbw.pr.cluedo.model.DataService;

import java.util.Random;

/**
 * GameLogic
 *
 * @author Peter Rutschmann
 * @version 25.10.2022
 */
public class GameLogic {

   /**
    * Setup randomly the secret of the game.
    * @param service Contains the list for actors, weapons and scenes.
    * @param secret  Randomly generate the secret for actor, weapon and scene.
    */
   public void setupNewGame(DataService service, Crime secret){
      //To be done
   }

   /**
    * Evaluates the suggestion to find the solution of the game.
    * @param suggestion The suggestion from the player
    * @param secret The game secret.
    * @param numberOfSuggestion Current number of suggestion
    * @param maxNumberOfSuggestions Max number of possible suggestions
    * @return true if games ends, false if another suggestion is allowed
    */
   public boolean evaluateSuggestion(Crime suggestion, Crime secret, int numberOfSuggestion,
        int maxNumberOfSuggestions){
      //To be done
      return false;
   }
}
