package lb2;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class Main {
    public static void main(String[] args) throws IOException {
        List<Hunter> hunters = loadHunters(Paths.get("hunters.csv"));

        // -------------------------------------------------------------------------
        // TEIL 1 - verschiedene Comparator-Formen (gut unterscheidbar)
        // -------------------------------------------------------------------------

        // 1a) Comparable: Natural Order über compareTo() in Hunter (nach Name)
        List<Hunter> naturalOrder = copy(hunters);
        Collections.sort(naturalOrder);
        printHunters("TEIL 1 - Comparable (Natural Order nach Name)", naturalOrder);

        // 1b) Comparator-Klasse: eigene Klasse, die Comparator implementiert
        List<Hunter> byInsightClass = copy(hunters);
        byInsightClass.sort(new HunterInsightComparator());
        printHunters("TEIL 1 - Comparator-Klasse (nach Insight)", byInsightClass);

        // 1c) Anonyme Klasse: ausführlich, ohne Lambda
        List<Hunter> byHuntStartAnonymous = copy(hunters);
        byHuntStartAnonymous.sort(new Comparator<Hunter>() {
            @Override
            public int compare(Hunter first, Hunter second) {
                return first.getHuntStart().compareTo(second.getHuntStart());
            }
        });
        printHunters("TEIL 1 - Anonyme Klasse (nach HuntStart)", byHuntStartAnonymous);

        // 1d) Lambda Expression: kompakt
        List<Hunter> byTransformedLambda = copy(hunters);
        byTransformedLambda.sort(
                (first, second) -> Boolean.compare(first.isTransformed(), second.isTransformed()));
        printHunters("TEIL 1 - Lambda Expression (nach Transformed)", byTransformedLambda);

        // 1e) Comparator Chain: mehrere Kriterien verkettet
        List<Hunter> byChain = copy(hunters);
        byChain.sort(Comparator
                .comparing(Hunter::isTransformed)
                .thenComparingInt(Hunter::getInsight)
                .thenComparing(Hunter::getName));
        printHunters("TEIL 1 - Comparator Chain (Transformed → Insight → Name)", byChain);

        // -------------------------------------------------------------------------
        // TEIL 2 - Sortierungsvarianten auf allen Attributen
        // -------------------------------------------------------------------------

        // Natural Order (nochmals explizit als Teil-2-Aspekt)
        List<Hunter> naturalOrderPart2 = copy(hunters);
        naturalOrderPart2.sort(Comparator.naturalOrder());
        printHunters("TEIL 2 - Natural Order (Name via Comparable)", naturalOrderPart2);

        // Reverse Order
        List<Hunter> reverseOrder = copy(hunters);
        reverseOrder.sort(Comparator.reverseOrder());
        printHunters("TEIL 2 - Reverse Order (Name absteigend)", reverseOrder);

        // Mehrstufige Sortierung: HuntStart, dann Name
        List<Hunter> multiLevelDates = copy(hunters);
        multiLevelDates.sort(Comparator
                .comparing(Hunter::getHuntStart)
                .thenComparing(Hunter::getName));
        printHunters("TEIL 2 - Mehrstufig (HuntStart → Name)", multiLevelDates);

        // Waffen-Attribute: je mindestens einmal verwendet
        List<Hunter> byWeaponName = copy(hunters);
        byWeaponName.sort(Comparator.comparing(hunter -> hunter.getWeapon().getName()));
        printHunters("TEIL 2 - nach Weapon-Name", byWeaponName);

        List<Hunter> byWeaponDamage = copy(hunters);
        byWeaponDamage.sort(Comparator.comparingInt(hunter -> hunter.getWeapon().getDamage()));
        printHunters("TEIL 2 - nach Weapon-Damage", byWeaponDamage);

        // Anonyme Klasse für ein weiteres Attribut (Weapon-Weight)
        List<Hunter> byWeaponWeight = copy(hunters);
        byWeaponWeight.sort(new Comparator<Hunter>() {
            @Override
            public int compare(Hunter first, Hunter second) {
                return Double.compare(
                        first.getWeapon().getWeight(),
                        second.getWeapon().getWeight());
            }
        });
        printHunters("TEIL 2 - Anonyme Klasse (nach Weapon-Weight)", byWeaponWeight);

        List<Hunter> byTrickWeapon = copy(hunters);
        byTrickWeapon.sort(Comparator.comparing(hunter -> hunter.getWeapon().isTrickWeapon()));
        printHunters("TEIL 2 - nach TrickWeapon", byTrickWeapon);

        // Mehrstufig über Waffen-Attribute
        List<Hunter> multiLevelWeapon = copy(hunters);
        multiLevelWeapon.sort(Comparator
                .comparingInt((Hunter hunter) -> hunter.getWeapon().getDamage())
                .thenComparingDouble(hunter -> hunter.getWeapon().getWeight())
                .thenComparing(hunter -> hunter.getWeapon().getName()));
        printHunters("TEIL 2 - Mehrstufig (Damage → Weight → Weapon-Name)", multiLevelWeapon);
    }

    private static List<Hunter> copy(List<Hunter> hunters) {
        return new ArrayList<>(hunters);
    }

    private static void printHunters(String title, List<Hunter> hunters) {
        System.out.println();
        System.out.println("=== " + title + " ===");
        String spacer = " - ";

        for (Hunter hunter : hunters) {
            System.out.println(
                    hunter.getName() + spacer +
                            hunter.getInsight() + spacer +
                            hunter.isTransformed() + spacer +
                            hunter.getHuntStart() + spacer +
                            hunter.getWeapon().getName() + spacer +
                            hunter.getWeapon().getDamage() + spacer +
                            hunter.getWeapon().getWeight() + spacer +
                            hunter.getWeapon().isTrickWeapon());
        }
    }

    public static List<Hunter> loadHunters(Path csvPath) throws IOException {
        List<Hunter> hunters = new ArrayList<>();

        try (BufferedReader reader = Files.newBufferedReader(csvPath)) {
            reader.readLine();
            String line;

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");

                String name = parts[0];
                int insight = Integer.parseInt(parts[1]);
                boolean transformed = Boolean.parseBoolean(parts[2]);
                LocalDate huntStart = LocalDate.parse(parts[3]);

                Weapon weapon = new Weapon(
                        parts[4],
                        Integer.parseInt(parts[5]),
                        Double.parseDouble(parts[6]),
                        Boolean.parseBoolean(parts[7]));

                hunters.add(new Hunter(name, insight, transformed, huntStart, weapon));
            }
        }

        return hunters;
    }
}
