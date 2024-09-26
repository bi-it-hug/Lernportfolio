package ch.bbw.pr.cluedo.control;

import ch.bbw.pr.cluedo.logic.GameLogic;
import ch.bbw.pr.cluedo.model.DataService;
import ch.bbw.pr.cluedo.model.Weapon;
import ch.bbw.pr.cluedo.model.Room;
import ch.bbw.pr.cluedo.model.Character;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class GameController {

    @Autowired
    private DataService service;
    private GameLogic gameLogic;

    @RequestMapping(value = {"/", "/startGame"}, method = RequestMethod.GET)
    public String startGame(Model model) {
        gameLogic = new GameLogic(service.getWeapons(), service.getRooms(), service.getCharacters());
        model.addAttribute("weapons", service.getWeapons());
        model.addAttribute("characters", service.getCharacters());
        model.addAttribute("rooms", service.getRooms());
        return "cluedolistview";
    }

    @PostMapping("/checkGuess")
    public String checkGuess(@RequestParam("character") String characterName,
                             @RequestParam("weapon") String weaponName,
                             @RequestParam("room") String roomName, Model model) {

        Character character = service.getCharacters().stream()
            .filter(c -> c.getName().equals(characterName))
            .findFirst()
            .orElse(null);

        Weapon weapon = service.getWeapons().stream()
            .filter(w -> w.getName().equals(weaponName))
            .findFirst()
            .orElse(null);

        Room room = service.getRooms().stream()
            .filter(r -> r.getName().equals(roomName))
            .findFirst()
            .orElse(null);

        if (gameLogic.checkGuess(character, weapon, room)) {
            model.addAttribute("message", "Correct Guess! You solved the mystery.");
            
        } else {
            model.addAttribute("message", "Incorrect Guess. Try again.");
        }
        return "cluedolistview";
    }
}
