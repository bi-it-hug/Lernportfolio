package dame;

/**
 * Dame Application
 * 
 * @author Peter Rutschmann
 * @version 07.11.2019
 */
public class Application {
    private static final String RESET = "\u001B[0m";
    private static final String BG_LIGHT = "\u001B[47m";
    private static final String BG_DARK = "\u001B[100m";
    private static final String FG_BLACK = "\u001B[30m";
    private static final String FG_WHITE = "\u001B[97m";
    private static final String QUEEN = "\u265B\uFE0E";
    private static final String EMPTY_CELL = "   ";
    private static final String QUEEN_CELL = " " + QUEEN + " ";

    public static void main(String[] args) {
        int size = 8;
        System.out.println("Damen Problem");
        System.out.println();

        for (int startColumn = 0; startColumn < size; startColumn++) {
            DameProblem solver = new DameProblem(size);
            System.out.println("Startspalte: " + (startColumn + 1));

            if (solver.setQueenWithStartColumn(startColumn)) {
                for (int i = 0; i < size; i++) {
                    for (int j = 0; j < size; j++) {
                        String background = ((i + j) % 2 == 0) ? BG_LIGHT : BG_DARK;
                        String queenColor = ((i + j) % 2 == 0) ? FG_BLACK : FG_WHITE;
                        if (solver.getBoard()[i][j] == 1) {
                            System.out.print(background + queenColor + QUEEN_CELL + RESET);
                        } else {
                            System.out.print(background + EMPTY_CELL + RESET);
                        }
                    }
                    System.out.println();
                }
            } else {
                System.out.println("Keine Loesung fuer diese Startspalte.");
            }

            System.out.println();
            System.out.println();
        }
    }
}

// chcp 65001
// [Console]::InputEncoding = [System.Text.UTF8Encoding]::new()
// [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
// $OutputEncoding = [System.Text.UTF8Encoding]::new()