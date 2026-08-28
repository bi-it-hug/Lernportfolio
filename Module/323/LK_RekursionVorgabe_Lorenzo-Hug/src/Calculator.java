
/**
 * Calculator
 * 
 * @author Lorenzo Hug
 * @version 27.03.2026
 */
public class Calculator {
    void rekursivAufgabe1(int a, int b, int c) {
        if (a < c) {
            System.out.print(a * b + " ");
            rekursivAufgabe1(a + 1, b + 2, c);
        } else {
            return;
        }
    }

    void loopAufgabe1(int a, int b, int c) {
        for (; a < c; a++, b += 2) {
            System.out.print(a * b + " ");
        }
    }

    int aufgabe2(int a, int b) {
        if (a == 0 || b == 0) {
            return 0;
        } else if (a % 2 == 0) {
            return aufgabe2(a / 2, b * 2);
        }
        return b + aufgabe2((a - 1) / 2, b * 2);
    }

    // Daten für Aufgabe 3 und 4 NICHT ÄNDERN!!
    char[] chars = { 'a', 'e', 'd', 's', 'r', 'n', 't', 'i', 'h', 'p', 'l', 'h', 'b', '.' };
    String[] code = { "001", "000", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101",
            "1110", "1111" };

    // Aufgabe 3 als loop NICHT ÄNDERN!!
    public String aufgabe3Loop(char character) {
        StringBuilder retVal = new StringBuilder();
        for (int index = 0; index < chars.length; index++) {
            if (chars[index] == character) {
                return code[index];
            }
        }
        return "not found";
    }

    public String aufgabe3Rekursiv(char character, int index) {
        if (index >= chars.length) {
            return "not found";
        }
        if (chars[index] == character) {
            return code[index];
        }
        return aufgabe3Rekursiv(character, index + 1);
    }

    // Aufgabe 4 als loop NICHT ÄNDERN!!
    public String aufgabe4Loop(String text) {
        StringBuilder retVal = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            int j = 0;
            for (; j < chars.length; j++) {
                if (chars[j] == text.charAt(i))
                    break;
            }
            if (j < chars.length)
                retVal.append(code[j] + " ");
            else
                retVal.append("--");
        }
        return retVal.toString();
    }

    public String aufgabe4Rekursiv(String text, int i) {
        if (i >= text.length()) {
            return "";
        }
        String current = findeCode(text.charAt(i), 0);
        return current + " " + aufgabe4Rekursiv(text, i + 1);
    }

    public String findeCode(char c, int j) {
        if (j >= chars.length) {
            return "--";
        }
        if (chars[j] == c) {
            return code[j];
        }
        return findeCode(c, j + 1);
    }
}
