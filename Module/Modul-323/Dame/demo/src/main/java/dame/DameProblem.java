package dame;

/**
 * DameProbelm
 * 
 * @author Peter Rutschmann
 * @version 07.11.2019
 */

public class DameProblem {
    private static final int FIELD_FREE = 0;
    private static final int FIELD_OCCUPIED = 1;

    private int size;
    private int[][] board;

    public int[][] getBoard() {
        return board;
    }

    public DameProblem(int size) {
        super();
        this.size = size;
        this.board = new int[size][size];
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                board[i][j] = FIELD_FREE;
            }
        }
    }

    public boolean setQueen(int row) {
        if (row >= size) {
            return true;
        }

        for (int i = 0; i < size; i++) {

            if (isValid(row, i)) {
                board[row][i] = FIELD_OCCUPIED;
                if (setQueen(row + 1)) {
                    return true;
                } else {
                    board[row][i] = FIELD_FREE;
                }
            }
        }
        return false;
    }

    public boolean setQueenWithStartColumn(int startColumn) {
        if (startColumn < 0 || startColumn >= size) {
            return false;
        }

        board[0][startColumn] = FIELD_OCCUPIED;
        return setQueen(1);
    }

    private boolean isValid(int r, int c) {
        // check vertically upwards
        for (int row = r - 1; row >= 0; row--) {
            if (board[row][c] == FIELD_OCCUPIED) {
                return false;
            }
        }

        // check upper left diagonal
        for (int row = r - 1, col = c - 1; row >= 0 && col >= 0; row--, col--) {
            if (board[row][col] == FIELD_OCCUPIED) {
                return false;
            }
        }

        // check upper right diagonal
        for (int row = r - 1, col = c + 1; row >= 0 && col < size; row--, col++) {
            if (board[row][col] == FIELD_OCCUPIED) {
                return false;
            }
        }

        return true;
    }
}
