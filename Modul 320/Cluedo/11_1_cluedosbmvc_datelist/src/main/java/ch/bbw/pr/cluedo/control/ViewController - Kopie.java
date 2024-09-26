/*
package ch.bbw.pr.cluedo.control;

import ch.bbw.pr.cluedo.logic.GameLogic;
import ch.bbw.pr.cluedo.model.Weapon;
import ch.bbw.pr.cluedo.model.Room;
import ch.bbw.pr.cluedo.model.Character;
import ch.bbw.pr.cluedo.model.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ViewController {

    @Autowired
    private DataService service;
    private GameLogic gameLogic;

    @RequestMapping(value = {"/", "/showView"}, method = RequestMethod.GET)
    public String showView(Model model){
        System.out.println("ViewController.showView");
        model.addAttribute("weapons", service.getWeapons());
        model.addAttribute("characters", service.getCharacters());
        model.addAttribute("rooms", service.getRooms());
        return "cluedolistview";
    }
}
*/
