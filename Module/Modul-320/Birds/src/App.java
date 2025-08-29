
import java.util.List;

public class App {

    public static void main(String[] args) throws Exception {

        List<Vogel> vogelList = List.of(
                new Vogel("Markus", "blau"),
                new Huhn("Tom", "rot"),
                new Ente("Andy", "gelb")
        );

        printEverything(vogelList);
    }

    private static void printEverything(List<Vogel> vogelList) {

        for (Vogel vogel : vogelList) {

            System.out.println();
            vogel.fliegen();
            vogel.flattern();

            switch (vogel) {
                case Ente ente ->
                    ente.schwimmen();

                case Huhn huhn ->
                    huhn.gackern();

                default -> {
                }
            }

            System.out.println();
        }
    }
}
