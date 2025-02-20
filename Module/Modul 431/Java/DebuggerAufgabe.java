import java.util.Scanner;

public class DebuggerAufgabe {
    public static void main(String[] args) { 
        //include scanner for reading input
        Scanner scan = new Scanner(System.in); 

        int input; //declare variable

        System.out.println("Geben Sie eine Zahl zwischen 2 und 6 ein:"); 

        input = scan.nextInt(); 

        if ((input >= 2) && (input <= 6)) { 
            int zaehler = 0; 
            for (int i = -5; i < 5; i++) { 
                zaehler = zaehler + i + input; 
                System.out.println(zaehler); 
            }

        } else { 
            System.err.println("Achtung, falsche Eingabe!"); 
        } 
        System.out.println("und fertig!"); 

        scan.close(); 
    }
}

/*

Aufgabe a)

    1) 15

    2) Bei der Zeile in der die for Schleife ausgeführt wird.
       In diesem fall also Zeile 16.

    3) F8

    4) 1


Aufgabe b)

    1) 25

    2) Auf den geraden Pfeil der Menü-Leiste klicken

    3) Remove All Breakpoints

    4) 2

 */