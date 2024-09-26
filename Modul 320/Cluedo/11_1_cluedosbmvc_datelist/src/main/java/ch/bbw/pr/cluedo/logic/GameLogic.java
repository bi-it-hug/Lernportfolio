package ch.bbw.pr.cluedo.logic;

import ch.bbw.pr.cluedo.model.Weapon;
import ch.bbw.pr.cluedo.model.Room;
import ch.bbw.pr.cluedo.model.Character;

import java.util.Collections;
import java.util.ArrayList;
import java.util.List;

public class GameLogic {

    private final Weapon selectedWeapon;
    private final Room selectedRoom;
    private final Character selectedCharacter;

    public GameLogic(List<Weapon> weapons, List<Room> rooms, List<Character> characters) {
        List<Weapon> mutableWeapons = new ArrayList<>(weapons);
        List<Room> mutableRooms = new ArrayList<>(rooms);
        List<Character> mutableCharacters = new ArrayList<>(characters);

        Collections.shuffle(mutableWeapons);
        Collections.shuffle(mutableRooms);
        Collections.shuffle(mutableCharacters);

        this.selectedWeapon = weapons.get(0);
        this.selectedRoom = rooms.get(0);
        this.selectedCharacter = characters.get(0);
    }

    public boolean checkGuess(Character character, Weapon weapon, Room room) {return character.equals(selectedCharacter) && weapon.equals(selectedWeapon) && room.equals(selectedRoom);}
    public Weapon getSelectedWeapon() {return selectedWeapon;}
    public Room getSelectedRoom() {return selectedRoom;}
    public Character getSelectedCharacter() {return selectedCharacter;}
}
