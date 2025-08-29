package ch.bbw.pr.cluedo.model;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DataService {

    /* ROOMS */
    private final List<Room> rooms = List.of(
        new Room(
            "Bar",
            20
        ),

        new Room(
            "Backseats",
            30
        ),

        new Room(
            "Stage",
            6
        ),

        new Room(
            "Back Section",
            4
        ),

        new Room(
            "Storage",
            4
        ),

        new Room(
            "Basement",
            12
        ),

        new Room(
            "Dungeons",
            100
        ),

        new Room(
            "Terrace",
            18
        ),

        new Room(
            "Restrooms",
            8
        )
    );

    /* WEAPONS */
    private final List<Weapon> weapons = List.of(
        new Weapon(
            "Lightsaber",
            "Meele Weapon",
            "Durasteel"
        ),

        new Weapon(
            "Blaster",
            "Ranged Weapon",
            "Metal Alloy"
        ),

        new Weapon(
            "Bowcaster",
            "Ranged Weapon",
            "Wroshyr Wood"
        ),

        new Weapon(
            "Thermal Detonator",
            "Throwing Explosive",
            "Plasma"
        ),

        new Weapon(
            "Vibroblade",
            "Meele Weapon",
            "Durasteel"
        ),

        new Weapon(
            "Force Lightning",
            "Force",
            "Force"
        )
    );

    /* CHARACTERS */
    private final List<Character> characters = List.of(
        new Character(
            "Darth Vader",
            "Sith Lord",
            "Force Choke",
            "Intimidating and secretive"
        ),

        new Character(
            "Luke Skywalker",
            "Jedi Knight",
            "Force Vision",
            "Honorable and determined"
        ),

        new Character(
            "Han Solo",
            "Smuggler",
            "Quick Draw",
            "Witty and unpredictable"
        ),

        new Character(
            "Chewbacca",
            "Wookie Warrior",
            "Wookie Strength",
            "Loyal and strong"
        ),

        new Character(
            "Yoda",
            "Jedi Master",
            "Mind Trick",
            "Wise and mysterious"
        ),

        new Character(
            "Boba Fett",
            "Bounty Hunter",
            "Tracker",
            "Cold and calculating"
        )
    );

    public List<Room> getRooms() {return rooms;}
    public List<Weapon> getWeapons() {return weapons;}
    public List<Character> getCharacters() {return characters;}
}
