import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class ToDoList {

    //Erstelle Objekte "input" und "toDoList"
    static Scanner input = new Scanner(System.in);
    static List<String> toDoList = new ArrayList<>();

    //Element zur Liste hinzufügen
    public static void addToList() {

            System.out.println("Add element: ");
            String addElement = input.nextLine();
            toDoList.add(addElement);

            System.out.println("successfully added " + addElement);
            askForInput();
        }
    
    //Element von der Liste entfernen
    public static void removeFromList() {

        System.out.println("Remove element: ");
        String removeElement = input.nextLine();

        //Überprüfen ob das zu enfernende Element in der Liste existiert
        if (toDoList.contains(removeElement)) {
            toDoList.remove(removeElement);

            System.out.println("successfully removed " + removeElement);
            askForInput();

        } else {
            System.out.println("Error, element not found");
            removeFromList();
        }
    }

    //Element in der Liste als "erledigt" markieren
    public static void markAsDone() {

        System.out.println("Mark element as done: ");
        String markElement = input.nextLine();

        if (toDoList.contains(markElement)) {

            //Hole den Index des Elements
            int indexOfElement = toDoList.indexOf(markElement);

            //Hole das Element des Indexes
            String elementOfIndex = toDoList.get(indexOfElement);

            //Füge dem Element in der Liste ein Stern hinzu
            toDoList.set(indexOfElement, elementOfIndex + " *");
            System.out.println("successfully marked " + markElement + " as done");
            askForInput();

        } else {
            System.out.println("Error, element not found");
            removeFromList();
        }
    }

    //Alle Elemente der Liste anzeigen
    public static void showList() {

        //Initialisiere einen Zähler um die Liste geordnet anzuzueigen
        int count = 1;
        System.out.println("");

        //Durchlaufe jedes Element und zeige es an
        for (String element : toDoList) {
            System.out.println(count + ". " + element);
            count += 1;
        }

        System.out.println("");
        askForInput();
    }

    //Eingaben vom Nutzer fordern
    public static void askForInput() {

        System.out.println("(1) add\n(2) remove\n(3) mark\n(4) show\n");
        String userInput = input.nextLine();

        /*
        Die Eingabe des Nutzers abfragen (Da in hier jeder Fall
        auf die gleiche Bedingung abgefragt wird, benutzen wir
        einen "switch" anstatt wie üblich "if", "elseif" oder "else".)
        */

        switch (userInput) {
            case "1":
                addToList();
                break;
            
            case "2":
                removeFromList();
                break;
            
            case "3":
                markAsDone();
                break;

            case "4":
                showList();
                break;
        
            default:
                System.out.println("ERROR");
                askForInput();
                break;
        }
    }

    public static void main(String[] args) {
        askForInput();
    }
}