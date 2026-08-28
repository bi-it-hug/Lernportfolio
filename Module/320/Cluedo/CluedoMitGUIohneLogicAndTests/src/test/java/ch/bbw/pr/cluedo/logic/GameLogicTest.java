package ch.bbw.pr.cluedo.logic;

import org.junit.jupiter.api.Test;

import ch.bbw.pr.cluedo.model.Crime;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;

class GameLogicTest {

    @Test
    void ActorWeaponSceneNotEqualThenReturnFalseAndHistory0() {
        assertFalse(true);
    }

    @Test
    void evaluateSuggestion() {
        Crime suggestion = new Crime();
        Crime secret = new Crime();
        int numberOfSuggestions = 0;
        int maxNumberOfSuggestions = 0;

        //setup secret
        secret.setActor(0);
        secret.setWeapon(0);
        secret.setScene(0);

        /* setup suggestion with same values as secret
     * so i expect to win :-)
         */
        suggestion.setActor(0);
        suggestion.setWeapon(0);
        suggestion.setScene(0);

        GameLogic gameLogic = new GameLogic();

        //return true  is expected
        assertEquals(true, gameLogic.evaluateSuggestion(suggestion, secret, numberOfSuggestions, maxNumberOfSuggestions));

    }

    private GameLogic gameLogic;
    private Crime suggestion;
    private Crime secret;
    private int numberOfSuggestion;
    private int maxNumberOfSuggestions;

    @BeforeEach
    private void setUpBevorEachTest() {
        gameLogic = new GameLogic();
        suggestion = new Crime();
        secret = new Crime();
    }

}
